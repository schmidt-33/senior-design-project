import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as constants from '../../../../../../pictionary/constants';
import { GameService } from '../../services/game.service';
import { Player } from 'src/app/shared/types/player';

@Component({
  selector: 'app-game-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  Constants = constants;
  wordListNames: string[] = []; 
  gameCode: string;
  ingameCount: number = 0;
  onlineCount: number = 0;
  players: Player[] = [];
  currentPlayer: Player;
  activePlayer: Player;

  isError = false;
  errorMessage = '';

  isJoiningGame = false;
  hasJoinedGame = false;
  isCreatingGame = false;
  hasStartedGame = false;
  gameEnded = false;

  roundStarted = false;
  roundEnded = false;
  roundTimer: number;

  constructor(
    private gameService: GameService,
  ) { }

  ngOnInit(): void {
    this.gameService.getOnlineCount().subscribe(
      (data: any) => {
        if (data.error) {
          throw new Error(data.error);
        }

        this.onlineCount = +data.count;
      },
      (error: any) => {
        console.log('Could not get online count', error);
      }
    );

    this.gameService.getWordListNames().subscribe(
      (data: any) => {
        if (data.error) {
          throw new Error(data.error);
        }

        this.wordListNames = data;
      },
      (error: any) => {
        console.log('Could not get word list names', error);
      }
    );
  }

  updateCreatingGameStatus(status: boolean) {
    this.isCreatingGame = status;
  }

  createGame({playerName, wordListName}): void {
    this.currentPlayer = this.gameService.createPlayer(playerName, true);
    this.gameService.createGame(this.currentPlayer, wordListName).subscribe(
      (data: any) => {
        if (data.error) {
          throw new Error(data.error);
        }
        this.gameCode = data.gameCode;
        this.players = data.players;
        this.hasJoinedGame = true;
        this.watchForPlayers();
        this.watchGameStatus();
      },
      (error: any) => {
        console.log('Could not create game', error);
      }
    );
  }

  updateJoiningGameStatus(status: boolean) {
    this.isJoiningGame = status;
  }

  joinGame({ gameCode, playerName }): void {
    const standardizedGameCode = gameCode.toUpperCase();
    this.currentPlayer = this.gameService.createPlayer(playerName);
    this.gameService.joinGame(standardizedGameCode, this.currentPlayer).subscribe(
      (data: any) => {
        if (data.error) {
          this.isError = true;
          
          if (data.code === 1) {
            this.errorMessage = `Game ${standardizedGameCode} doesn't exist.`;
          } else if (data.code === 2) {
            this.errorMessage = `Game ${standardizedGameCode} is already in progress and cannot be joined.`;
          } else if (data.code === 3) {
            this.errorMessage = `Game ${standardizedGameCode} already has the maximum number of players.`;
          }

          setTimeout(() => {
            this.isError = false;
            window.location.reload(); // FIXME temp bug workaround
          }, 2000);

          throw new Error(data.error);
        }

        this.gameCode = standardizedGameCode;
        this.players = data.players;
        this.isJoiningGame = false;
        this.hasJoinedGame = true;
        this.watchForPlayers();
        this.watchGameStatus();
      },
      (error: any) => {
        console.log('Could not join game', error);
      }
    );
  }

  leaveGame(): void {
    this.gameService.leaveGame(this.gameCode, this.currentPlayer).subscribe(
      (data: any) => {
        if (data.error) {
          throw new Error(data.error);
        }
      },
      (error: any) => {
        console.log('Could not leave game', error);
      }
    );

    this.gameCode = undefined;
    this.players = [];
    this.isJoiningGame = false;
    this.hasJoinedGame = false;
    this.isCreatingGame = false;
    this.hasStartedGame = false;
    this.gameEnded = false;

  }

  watchForPlayers(gameCode?: string) {
    this.gameService.getPlayers(gameCode).subscribe(
      (data: any) => {
        if (data.error) {
          throw new Error(data.error);
        }

        this.players = data.players;
      },
      (error: any) => {
        console.log('Could not get players', error);
      }
    );
  }

  watchGameStatus(gameCode?: string) {
    this.gameService.getGameStatus().subscribe(
      (data: any) => {
        if (data.error) {
          throw new Error(data.error);
        }

        this.roundEnded = !this.roundEnded && this.roundStarted && !data.roundStarted;
        this.hasStartedGame = data.started;
        this.gameEnded = data.stopped;
        this.activePlayer = data.activePlayer;
        this.roundStarted = data.roundStarted;
        this.roundTimer = data.roundTimer;
        
      },
      (error: any) => {
        console.log('Could not get game status', error);
      }
    );

  }

  startGame(): void {
    this.gameService.startGame(this.gameCode).subscribe(
      (data: any) => {
        if (data.error) {
          throw new Error(data.error);
        }

        this.hasStartedGame = true;
      },
      (error: any) => {
        console.log('Could not start game', error);
        this.hasStartedGame = false;
      }
    );
  }

  stopGame(): void {
    this.gameService.stopGame(this.gameCode).subscribe(
      (data: any) => {
        if (data.error) {
          throw new Error(data.error);
        }

        this.hasStartedGame = true;
      },
      (error: any) => {
        console.log('Could not stop game', error);
        this.hasStartedGame = false;
      }
    );
  }

  restartGame(): void {
    this.gameService.restartGame(this.gameCode).subscribe(
      (data: any) => {
        if (data.error) {
          throw new Error(data.error);
        }
        
        this.hasStartedGame = true;
      },
      (error: any) => {
        console.log('Could not restart game', error);
        this.hasStartedGame = false;
      }
    );
  }

}
