import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { LeaderboardEntry } from './leaderboard.types';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'leaderboard.json');
const TOP_N = 10;

@Injectable()
export class LeaderboardService {
  private scores: LeaderboardEntry[] = [];

  constructor() {
    this.load();
  }

  getTop(): LeaderboardEntry[] {
    return this.scores.slice(0, TOP_N);
  }

  add(name: string, score: number): LeaderboardEntry[] {
    const safeName =
      String(name ?? '')
        .trim()
        .slice(0, 24) || 'Anonymous';
    const entry: LeaderboardEntry = {
      name: safeName,
      score: Number(score) || 0,
      date: new Date().toISOString(),
    };
    this.scores.push(entry);
    this.scores.sort(
      (a, b) => b.score - a.score || b.date.localeCompare(a.date),
    );
    this.scores = this.scores.slice(0, TOP_N * 3); // keep a little buffer on disk
    this.save();
    return this.getTop();
  }

  private load() {
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      if (fs.existsSync(FILE)) {
        const raw = fs.readFileSync(FILE, 'utf-8');
        this.scores = JSON.parse(raw) ?? [];
      }
    } catch {
      this.scores = [];
    }
  }

  private save() {
    try {
      fs.writeFileSync(FILE, JSON.stringify(this.scores, null, 2), 'utf-8');
    } catch {}
  }
}
