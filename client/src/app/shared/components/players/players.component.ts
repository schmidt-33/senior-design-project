import { Component, Input, OnInit } from '@angular/core';
import { Player } from '../../types/player';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {

  @Input() players: Player[];
  @Input() showScores: boolean = false;
  @Input() displayAsTwoColumns: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
