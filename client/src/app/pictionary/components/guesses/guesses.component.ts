import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/shared/types/player';
import { Guess } from '../../types/guess';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-guesses',
  templateUrl: './guesses.component.html',
  styleUrls: ['./guesses.component.css']
})
export class GuessesComponent implements OnInit {

  @Input() gameCode: string;
  @Input() currentPlayer: Player;
  @Input() playerTurn: boolean;

  guesses: Guess[] = [];
  newGuess: string = '';
  canSubmitGuess: boolean = true;

  constructor(
    private gameService: GameService,
  ) { }

  ngOnInit(): void {
    this.getGuesses();
    this.watchGameStatus();
  }

  getGuesses() {
    return this.gameService.getGuesses(this.gameCode).subscribe(
      (data: any) => {
        if (data.error) {
          throw new Error(data.error);
        }
        this.guesses = data.guesses;
        
      },
      (error: any) => {
        console.log('Could not get guesses', error);
      }
    );
  }

  watchGameStatus(gameCode?: string) {
    this.gameService.getGameStatus().subscribe(
      (data: any) => {
        if (data.error) {
          throw new Error(data.error);
        }

        if (!data.roundStarted) {
          this.guesses = [];
          this.canSubmitGuess = true;
        }
        
      },
      (error: any) => {
        console.log('Could not get game status', error);
      }
    );

  }

  submitGuess() {
	  console.log(`this.canSubmitGuess: ${this.canSubmitGuess}`)
	  console.log(`this.newGuess.length: ${this.newGuess.length}`)
	const guessString: HTMLInputElement = document.getElementById('guess-text') as HTMLInputElement;
	console.log(guessString.value);
    if (this.canSubmitGuess && guessString.value.length > 0) {
      this.gameService.submitGuess(this.gameCode, this.currentPlayer, guessString.value).subscribe(
        (data: any) => {
          if (data.error) {
            throw new Error(data.error);
          }
  
          if (data.correctGuess) {
            this.canSubmitGuess = false;
          }
          
        },
        (error: any) => {
          console.log('Could not submit guess', error);
        }
      );

      this.newGuess = '';
	  guessString.value = '';
    }
  }

}
