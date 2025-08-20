import { Injectable } from '@nestjs/common';
import { Board } from './types';
import { generateInitialBoard } from './board';

@Injectable()
export class StateService {
  private score = 0;
  private board: Board = [];
  private gameId = Date.now();
  private submitted = false;

  constructor() {
    this.reset();
  }

  getState() {
    return { score: this.score, board: this.board };
  }

  getMeta() {
    return { gameId: this.gameId, submitted: this.submitted };
  }

  isSubmitted() {
    return this.submitted;
  }

  markSubmitted() {
    this.submitted = true;
  }

  setBoard(b: Board) {
    this.board = b;
  }

  incScore() {
    this.score += 1;
  }

  reset() {
    this.score = 0;
    this.board = generateInitialBoard();
    this.gameId = Date.now();
    this.submitted = false;
  }
}
