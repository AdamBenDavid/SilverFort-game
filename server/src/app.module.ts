import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { HealthController } from './http/health.controller';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [GameModule, LeaderboardModule],
  controllers: [HealthController],
})
export class AppModule {}
