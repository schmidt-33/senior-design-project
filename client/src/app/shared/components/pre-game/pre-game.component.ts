import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Player } from '../../types/player';

@Component({
  selector: 'app-pre-game',
  templateUrl: './pre-game.component.html',
  styleUrls: ['./pre-game.component.css']
})
export class PreGameComponent implements OnInit {

  @Input() gameCode: string;
  @Input() players: Player[];
  @Input() minimumPlayers: number;
  @Input() maximumPlayers: number;
  @Input() currentPlayer: Player;
  @Output() gameStarted = new EventEmitter<String>();
  @Output() gameLeft = new EventEmitter<String>();

  isVIP: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.isVIP = this.currentPlayer.isVIP;
  }

  startGame() {
    this.gameStarted.emit();
  }

  leaveGame() {
    this.gameLeft.emit();
  }

  hasTooFewPlayers() {
    return this.players.length < this.minimumPlayers;
  }

  hasTooManyPlayers() {
    return this.players.length > this.maximumPlayers;
  }

}
