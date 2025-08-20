import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { StateService } from './state.service';

@Module({
  providers: [GameGateway, StateService],
  exports: [StateService],
})
export class GameModule {}
