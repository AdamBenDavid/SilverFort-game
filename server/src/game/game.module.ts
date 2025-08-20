import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { StateService } from './state.service';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';

@Module({
  imports: [LeaderboardModule],
  providers: [GameGateway, StateService],
  exports: [StateService],
})
export class GameModule {}
