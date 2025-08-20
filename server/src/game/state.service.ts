import { Injectable } from '@nestjs/common';
import { Board } from './types';
import { generateInitialBoard } from './board';

@Injectable()
export class StateService {
  private score = 0;
  private board: Board = [];

  constructor() {
    this.reset();
  }

  getState() {
    return { score: this.score, board: this.board };
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
  }
}
