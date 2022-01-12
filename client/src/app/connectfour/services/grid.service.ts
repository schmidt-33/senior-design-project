import { Injectable } from '@angular/core';
import {Case} from './case';

@Injectable()
export class GridService {

  constructor() { }

  hasFour(currentPlayer: number, grid: Case[][]): boolean {
    let hasFour = false;
    let done = false;
    while (!hasFour && !done) {
      hasFour = this.checkHorizontal(currentPlayer, grid);
      if (hasFour) {
        break;
      }
      hasFour = this.checkVertical(currentPlayer, grid);
      if (hasFour) {
        break;
      }
      hasFour = this.checkDiagUp(currentPlayer, grid);
      if (hasFour) {
        break;
      }
      hasFour = this.checkDiagDown(currentPlayer, grid);
      done = true;
    }
    return hasFour;
  }

  checkHorizontal(currentPlayer: number, grid: Case[][]): boolean {
    let hasFourHorizontal = false;
    let i = 0;
    while (!hasFourHorizontal && i < 6) {
      let res = 0;
      let k = 0;
      while (res < 4 && k < 7) {
        const c: Case = grid[i][k];
        if (c.state === currentPlayer) {
          res++;
        } else {
          res = 0;
        }
        k++;
      }
      hasFourHorizontal = res === 4;
      i++;
    }
    return hasFourHorizontal;
  }

  checkVertical(currentPlayer: number, grid: Case[][]): boolean {
    let hasFourVertical = false;
    let j = 0;
    while (!hasFourVertical && j < 7) {
      let res = 0;
      let k = 0;
      while (res < 4 && k < 6) {
        const c: Case = grid[k][j];
        if (c.state === currentPlayer) {
          res++;
        } else {
          res = 0;
        }
        k++;
      }
      hasFourVertical = res === 4;
      j++;
    }
    return hasFourVertical;
  }

  checkDiagUp(currentPlayer: number, grid: Case[][]): boolean {
    let hasDiagUp = false;
    let i = 0;
    while (!hasDiagUp && i < 6) {
      let res = 0;
      let k;
      if (i >= 0 && i <= 2) {
        k = 6;
        let line = i;
        while (res < 4 && line < 6) {
          const c: Case = grid[line][k];
          if (c.state === currentPlayer) {
            res++;
          } else {
            res = 0;
          }
          line++;
          k--;
        }
      } else {
        k = 0;
        let line = i;
        while (res < 4 && line >= 0) {
          const c: Case = grid[line][k];
          if (c.state === currentPlayer) {
            res++;
          } else {
            res = 0;
          }
          line--;
          k++;
        }
      }
      hasDiagUp = res === 4;
      i++;
    }
    return hasDiagUp;
  }

  checkDiagDown(currentPlayer: number, grid: Case[][]): boolean {
    let hasDiagDown = false;
    let i = 0;
    while (!hasDiagDown && i < 6) {
      let res = 0;
      let k;
      if (i >= 0 && i <= 2) {
        k = 0;
        let line = i;
        while (res < 4 && line < 6) {
          const c: Case = grid[line][k];
          if (c.state === currentPlayer) {
            res++;
          } else {
            res = 0;
          }
          line++;
          k++;
        }
      } else {
        k = 6;
        let line = i;
        while (res < 4 && line >= 0) {
          const c: Case = grid[line][k];
          if (c.state === currentPlayer) {
            res++;
          } else {
            res = 0;
          }
          line--;
          k--;
        }
      }
      hasDiagDown = res === 4;
      i++;
    }
    return hasDiagDown;
  }
}
