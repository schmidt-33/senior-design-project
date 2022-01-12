import { Component, OnInit } from '@angular/core';
import {GameService} from '../services/game.service';
import { ConnectfourService } from '../services/connectfour.service';
import { BehaviorSubject, Observable } from 'rxjs';
@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  public pieces = [{visible: false}, {visible: false}, {visible: false}, {visible: false}, {visible: false}, {visible: false}, {visible: false}];
  public winner: number = 0;
  private _game: GameService;

  constructor(
    game: GameService, 
    private websocketService: ConnectfourService
    
    ) {
    this._game = game;
  }

  add(column: number) {
    const winner = this._game.addPiece(column);
    this.websocketService.connectfourTurnSE(this.gameCode,column,this.playerNumber)
    this.uisegment.style.pointerEvents = 'none';

     console.log(' Hello Add function went off');
    if (winner === 0) {
      //this._game.nextPlayer();
    } else if (winner !== -1) {
      this.winner = winner;
    }
  }

  show(i: number) {
    this.pieces.map((piece, index) => piece.visible = i === index);
  }

  get game(): GameService {
    return this._game;
  }

  

  playAgain() {
    this._game.clear();
    this.pieces = [{visible: false}, {visible: false}, {visible: false}, {visible: false}, {visible: false}, {visible: false}, {visible: false}];
    this.winner = 0;
  }
  restart() {
    this._game.clear();
  }

uisegment: HTMLElement

  newGameButton: any;
  singleplayerButton: any;
  initialScreen: any;
  gameScreen: any;
  gameCodeInput: any;
  gameCodeDisplay: any;
  joinGameButton: any;
  playerNumber: any;
  gameCode: string;
  onlineCount: number;
  rematchButton: any;
  battleHomeButton: any;
  gameWinnerMessage: any;
  gameActive = false;
  rematchButtonDisabled: boolean = true;
  connectfourHomeButtonDisabled: boolean = true;
  stateReceived: boolean = false;     
  rematchCount: number = 0;    
  num: any;
  //turn$ = new BehaviorSubject<string>(null);
	 turn: any;

  ngOnInit() {
    this.handleGameCode();//
    this.handleInit();//
    this.handleTooManyPlayers();//
    this.handleUnknownGame();//
    this.handleOnlineCount();//
    this.handleRematchCount();//
    this.handleGameOver();//



    this.handlePiecedata();
    
    //this.handleGameState();



    //html document values 
    this.gameScreen = document.querySelector('#gameScreen');
    this.initialScreen = document.querySelector('#initialScreen');
    this.newGameButton = document.querySelector('#newGameButton');
    this.joinGameButton = document.querySelector('#joinGameButton');
    this.gameCodeInput = document.querySelector('#gameCodeInput');
    this.gameCodeDisplay = document.querySelector('#gameCodeDisplay');
    this.rematchButton = document.querySelector('#rematchButton');
    this.battleHomeButton = document.querySelector('#battleHomeButton');

    this.uisegment= document.querySelector('.ui-basic-segment');

    this.newGameButton.addEventListener('click', this.newGame.bind(this));
    this.joinGameButton.addEventListener('click', this.joinGame.bind(this));

  }
  handlePiecedata() {

    this.websocketService.connectfourTurnRE().subscribe(data => {
        const column = data['x1'];
        const playerEnemy = data['x2'];

      if(this.playerNumber != playerEnemy ){
        const winner = this._game.addPieceEnemy(column);
        this.uisegment.style.pointerEvents = 'all';

        if (winner === 0) {
          
        } else if (winner !== -1) {
          this.winner = winner;
        }


      }



		});
    


  }


  init() {//ok
    this.initialScreen.style.display = 'none';
    this.gameScreen.style.display = 'block';
    this.gameWinnerMessage = "";
    this.gameActive = true;

  }

  newGame() {//ok
    this.websocketService.connectfourNewGame();
    this.init();
    this.uisegment.style.pointerEvents = 'all';


  }

  joinGame() {//ok
    const code = this.gameCodeInput.value;
    this.gameCode = this.gameCodeInput.value;
    this.websocketService.connectfourJoinGame(code.toString());
    this._game.nextPlayer();
    this.init();
    this.uisegment.style.pointerEvents = 'none';
    
  }

  handleInit() {//ok
    this.websocketService.connectfourInit().subscribe(data => {
      this.playerNumber = data['playerNumber'];
    });
  }

  handleGameState() {
    this.websocketService.connectfourGamestate().subscribe(data => {

    });
  }

  rematch() {//ok
    if (this.rematchButtonDisabled === false) {
      this.websocketService.connectfourSendRematchEvent(this.gameCode);
    }
  }

  
  handleGameCode() {//ok
    this.websocketService.connectfourGameCode().subscribe(data => {
      console.log(data['gameCode'])
      this.gameCodeDisplay.innerText = data['gameCode'];
      this.gameCode = data['gameCode'];
    })
  }

  handleUnknownGame() {//ok
    this.websocketService.connectfourUnknownGame().subscribe(data => {
      this.reset();
      alert('Unknown game code');
    })
  }

  handleTooManyPlayers() {//ok
    this.websocketService.connectfourTooManyPlayers().subscribe(data => {
      this.reset();
      alert('This game is already in progress');
    })
  }

  handleOnlineCount() {//ok
    this.websocketService.connectfourOnlineCount().subscribe(data => {
      this.onlineCount = parseInt(data['rematchCount']);
    })
  }

  handleRematchCount() {//ok
    this.websocketService.connectfourRematchCount().subscribe(data => {
      this.rematchCount = parseInt(data['rematchCount'])
      if (this.rematchCount === 2) {
        this.rematchCount = 0;
        this.rematchButtonDisabled = true;
        this.connectfourHomeButtonDisabled = true;
      }
    });
  }

  handleGameOver() {
    this.websocketService.connectfourGameOver().subscribe(data => {
      if (this.playerNumber === parseInt(data['winner'])) {
        this.gameWinnerMessage = "You Win!";
      }
      else {
        this.gameWinnerMessage = "You Lose";
      }

      this.gameActive = false;
      this.rematchButtonDisabled = false;
      this.connectfourHomeButtonDisabled = false;
      this.stateReceived = false;
    })
  }

  reset() {//ok
    this.playerNumber = null;
    this.gameCodeInput.value = "";
    this.gameCodeDisplay.innerText = "";
    this.initialScreen.style.display = "block";
    this.gameScreen.style.display = "none";
  }

 

}
