import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-player-counter',
  templateUrl: './player-counter.component.html',
  styleUrls: ['./player-counter.component.css']
})
export class PlayerCounterComponent implements OnInit, OnChanges {

  @Input() gameCode: string;
  @Input() ingameCount: number;
  @Input() onlineCount: number;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    
  }

}
