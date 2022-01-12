import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {

  @Input() canChooseName: boolean = true;
  @Input() wordListNames: string[] = [];
  @Output() isCreatingGame = new EventEmitter<boolean>();
  @Output() gameCreated = new EventEmitter<{ playerName: string, wordListName: string }>();
  creatingGame: boolean = false;
  playerName: string = '';
  wordListName: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  createGame() {
    if (this.creatingGame && this.canCreateGame()) {
      this.gameCreated.emit({ playerName: this.playerName, wordListName: this.wordListName });
    } else {
      this.creatingGame = true;
      this.isCreatingGame.emit(this.creatingGame);
    }
  }

  cancelCreateGame() {
    this.creatingGame = false;
    this.isCreatingGame.emit(this.creatingGame);
  }

  hasPlayerName() {
    return this.playerName.length > 0;
  }

  hasSelectedWordList() {
    return this.wordListName.length > 0;
  }

  canCreateGame() {
    const playerNameError = this.canChooseName && !this.hasPlayerName();
    const wordListError = !this.hasSelectedWordList();
    return !(playerNameError || wordListError);
  }

}
