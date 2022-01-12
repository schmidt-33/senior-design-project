import { Component, Input, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';



@Component({
  selector: 'app-round-word-chooser',
  templateUrl: './round-word-chooser.component.html',
  styleUrls: ['./round-word-chooser.component.css']
})
export class RoundWordChooserComponent implements OnInit {

  @Input() gameCode: string;

  roundWords: string[] = [];

  constructor(
    private gameService: GameService,
  ) { }

  ngOnInit(): void {
    this.getRoundWords();
  }

  getRoundWords() {
    this.gameService.getRoundWords(this.gameCode).subscribe(
      (data: any) => {
        if (data.error) {
          throw new Error(data.error);
        }
        this.roundWords = data;
      },
      (error: any) => {
        console.log('Could not get round words', error);
      }
    );
  }

  startRound(word) {
    this.gameService.startRound(this.gameCode, word).subscribe();
  }

}
