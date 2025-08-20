import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { StateService } from './state.service';
import {
  anyValidForCell,
  applyFromOptions,
  applyValidRandomChange,
  decrementCooldowns,
  optionsForCell,
} from './board';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(GameGateway.name);

  constructor(private readonly state: StateService) {}

  handleConnection(client: any) {
    this.logger.log(`Client connected: ${client.id}`);
    this.server.emit('init', this.state.getState());
  }

  @SubscribeMessage('clickCell')
  @SubscribeMessage('clickCell')
  handleClick(@MessageBody() { row, col }: { row: number; col: number }) {
    this.logger.debug(`Click received on cell [${row}, ${col}]`);
    const { board, score } = this.state.getState();
    const cell = board[row]?.[col];
    if (!cell || cell.cooldown > 0) return;

    const { shapes, colors } = optionsForCell(board, row, col);

    if (shapes.length === 0 || colors.length === 0) {
      this.server.emit('gameOver', { board, score });
      return;
    }

    const updated = applyFromOptions(board, row, col)!;
    this.state.setBoard(updated);
    this.state.incScore();
    this.server.emit('update', this.state.getState());
  }

  @SubscribeMessage('reset')
  handleReset() {
    this.logger.warn('Game reset requested');
    this.state.reset();
    this.server.emit('init', this.state.getState());
  }
}
