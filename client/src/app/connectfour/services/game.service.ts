import { Injectable } from '@angular/core';
import {Case} from './case';
import {GridService} from "./grid.service";
import { WebsocketService } from './../../shared/services/websocket/websocket.service';
import { ConnectfourService } from './connectfour.service';
import { GridComponent } from '../grid/grid.component';
import { isThisTypeNode } from 'typescript';

@Injectable()
export class GameService {

  private _grid: Case[][] = [];
  private _currentPlayer: number = 1;
  private _enemyPlayer: number;
  public _gridManager: GridService;
  

  constructor(gridManager: GridService) {
    for (let i = 0; i < 6; i++) {
      let columns = [];
      for (let i = 0; i < 7; i++) {
        columns.push(new Case(0));
      }
      this._grid.push(columns);
      this._gridManager = gridManager;
    }
  }

  get currentPlayer(): number {
        this._enemyPlayer 

    return this._currentPlayer;
  }

  set currentPlayer(player: number) {
    this._currentPlayer = player;
    
    
  }

  isPlayerOne(): boolean {
    return this._currentPlayer === 1;
  }

  isPlayerTwo(): boolean {
    return this._currentPlayer === 2;
  }


//add piece function is what places piece on grid
  addPiece(column: number): number {
    if (column >= 0 && column < this._grid[0].length && this._grid[0][column].isEmpty()) {
      let i = 5;
      while (!this._grid[i][column].isEmpty()) {
        i--;
      }
      
      this._grid[i][column].state = this._currentPlayer;
      return this._gridManager.hasFour(this._currentPlayer, this._grid) ? this._currentPlayer : 0;
    } else {
      return -1;
    }
  }
//function created for multiplayer purposes
  addPieceEnemy(column: number): number {
    if (column >= 0 && column < this._grid[0].length && this._grid[0][column].isEmpty()) {
      let i = 5;
      while (!this._grid[i][column].isEmpty()) {
        i--;
      }
      if(this._currentPlayer==2)
      {
        this._enemyPlayer =1;

      }
      if(this._currentPlayer==1)
      {
        this._enemyPlayer =2;

      }
      console.log(this._currentPlayer);
      console.log(this._enemyPlayer);
      
      this._grid[i][column].state = this._enemyPlayer;
      return this._gridManager.hasFour(this._enemyPlayer, this._grid) ? this._enemyPlayer : 0;
    } else {
      return -1;
    }
  }

  //function that changes to next player
  nextPlayer() {
    this._currentPlayer = (this._currentPlayer === 1) ? 2 : 1;
  }

  get grid(): Case[][] {
    return this._grid;
  }

  clear() {
    this._grid = [];
    for (let i = 0; i < 6; i++) {
      let columns = [];
      for (let i = 0; i < 7; i++) {
        columns.push(new Case(0));
      }
      this._grid.push(columns);
    }
    this._currentPlayer = 1;
  }

}
