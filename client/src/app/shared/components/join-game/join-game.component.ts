import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import * as constants from '../../../../../../pictionary/constants';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css']
})
export class JoinGameComponent implements OnInit {

  @Output() isJoiningGame = new EventEmitter<boolean>();
  @Output() gameJoined = new EventEmitter<{gameCode: string, playerName: string}>();
  joiningGame: boolean = false;
  gameCode: string = '';
  playerName: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  joinGame() {
    if (this.joiningGame) {
      this.gameJoined.emit({ gameCode: this.gameCode, playerName: this.playerName });
      this.joiningGame = false;
    } else {
      this.joiningGame = true;
      this.isJoiningGame.emit(this.joiningGame);
    } 
  }

  cancelJoinGame() {
    this.joiningGame = false;
    this.isJoiningGame.emit(this.joiningGame);
  }

  hasGameCode() {
    return this.gameCode.length === constants.codeLength;
  }

  hasPlayerName() {
    return this.playerName.length > 0;
  }

}
