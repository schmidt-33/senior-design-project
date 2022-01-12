import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Player } from 'src/app/shared/types/player';
import * as constants from '../../../../../../pictionary/constants';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  @Input() gameCode: string;
  @Input() currentPlayer: Player;
  @Input() players: Player[];
  @Input() activePlayer: Player;
  @Input() roundStarted: boolean;
  @Input() roundEnded: boolean;
  @Input() roundTimer: number;
  @Output() gameLeft = new EventEmitter();

  minimumPlayers = constants.minimumPlayers;
  maximumPlayers = constants.maximumPlayers;

  gameOver: boolean = false;

  constructor(
    private gameService: GameService,
  ) { }

  ngOnInit(): void {
  }

  isPlayerTurn() {
    return this.currentPlayer.id === this.activePlayer.id;
  }

  canvasUpdated({ canvas }) {
    this.gameService.canvasUpdated(this.gameCode, canvas);
  }

  leaveGame() {
    this.gameLeft.emit();
  }

}