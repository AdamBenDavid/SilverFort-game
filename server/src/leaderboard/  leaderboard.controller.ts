import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import type { SubmitScoreDto } from './leaderboard.types';
import { LeaderboardService } from './leaderboard.service'; // <-- type-only

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly svc: LeaderboardService) {}

  @Get()
  getTop() {
    return this.svc.getTop();
  }

  @Post()
  submit(@Body() body: SubmitScoreDto) {
    const { name, score } = body ?? {};
    if (typeof score !== 'number' || Number.isNaN(score)) {
      throw new BadRequestException('score must be a number');
    }
    return this.svc.add(name, score);
  }
}
