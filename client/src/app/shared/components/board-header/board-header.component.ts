import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Player } from '../../types/player';

@Component({
  selector: 'app-board-header',
  templateUrl: './board-header.component.html',
  styleUrls: ['./board-header.component.css']
})
export class BoardHeaderComponent implements OnInit {

  @Input() gameCode: String = "";
  @Input() activePlayer: Player;
  @Input() roundTimer: number;

  constructor() { }

  ngOnInit(): void {
  }

  hasTimer() {
    return this.roundTimer >= 0;
  }

}
