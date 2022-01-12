import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-board-footer',
  templateUrl: './board-footer.component.html',
  styleUrls: ['./board-footer.component.css']
})
export class BoardFooterComponent implements OnInit {

  @Input() gameOver: boolean = false;
  @Output() gameLeft = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  leaveGame() {
    this.gameLeft.emit();
  }

}
