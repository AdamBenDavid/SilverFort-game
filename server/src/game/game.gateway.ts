import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { StateService } from './state.service';
import {
  anyValidForCell,
  applyFromOptions,
  applyValidRandomChange,
  decrementCooldowns,
  optionsForCell,
} from './board';
import { Logger } from '@nestjs/common';
import { LeaderboardService } from 'src/leaderboard/leaderboard.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(GameGateway.name);

  constructor(
    private readonly state: StateService,
    private readonly leaderboard: LeaderboardService,
  ) {}

  handleConnection(client: any) {
    this.logger.log(`Client connected: ${client.id}`);
    this.server.emit('init', {
      ...this.state.getState(),
      ...this.state.getMeta(),
    });
  }

  @SubscribeMessage('clickCell')
  handleClick(@MessageBody() { row, col }: { row: number; col: number }) {
    this.logger.debug(`Click received on cell [${row}, ${col}]`);
    const { board, score } = this.state.getState();
    const cell = board[row]?.[col];
    if (!cell || cell.cooldown > 0) return;

    const { shapes, colors } = optionsForCell(board, row, col);

    if (shapes.length === 0 || colors.length === 0) {
      const meta = this.state.getMeta();
      this.server.emit('gameOver', { board, score, gameId: meta.gameId });
      return;
    }

    const updated = applyFromOptions(board, row, col)!;
    this.state.setBoard(updated);
    this.state.incScore();
    this.server.emit('update', {
      ...this.state.getState(),
      ...this.state.getMeta(),
    });
  }

  @SubscribeMessage('submitScore')
  handleSubmitScore(
    @MessageBody() data: { gameId: number; name: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { gameId, name } = data ?? {};
    const score = this.state.getState().score;
    const meta = this.state.getMeta();

    // accept only if same game and not yet submitted
    if (gameId !== meta.gameId || this.state.isSubmitted()) {
      // politely reject this client (others already handled it)
      socket.emit('scoreRejected', { reason: 'already-submitted' });
      return;
    }

    // persist and broadcast
    this.leaderboard.add(name || `Player-${socket.id.slice(0, 5)}`, score);
    const top10 = this.leaderboard.getTop();

    this.state.markSubmitted();

    // notify ALL clients to close their prompt + show leaderboard
    this.server.emit('scoreSaved', {
      by: socket.id,
      name,
      score,
      gameId,
      leaderboard: top10,
    });
  }

  @SubscribeMessage('reset')
  handleReset() {
    this.logger.warn('Game reset requested');
    this.state.reset();
    this.server.emit('init', {
      ...this.state.getState(),
      ...this.state.getMeta(),
    });
  }
}
