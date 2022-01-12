import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TictactoeService } from '../services/tictactoe.service';

@Component({
	selector: 'app-tictactoe',
	templateUrl: './tictactoe.component.html',
	styleUrls: ['./tictactoe.component.css'],
})
export class TictactoeComponent implements OnInit {
	
	colorPickerDisabled = true;

	counter: any;
	gameScreen: any;
	gameActive = false;
	stateReceived: boolean = false;
	initialScreen: any;
	newGameButton: any;
	joinGameButton: any;
	rematchButton: any;
	tictactoeHomeButton: any;
	gameCodeInput: any;
	gameCodeDisplay: any;
	gameCode: string;
	playerNumber: any;
	rematchCount: number = 0;
	gameWinnerMessage: any;
	rematchButtonDisabled: boolean = true;
	tictactoeHomeButtonDisabled: boolean = true;
	onlineCount: number;
    gameCount: number;
    currentText: string;
	squareID: number;
	playerText: string;
	playerWins = 0;
	playerLosses = 0;
	gameState = {
        board: {
            0: '',
            1: '',
            2: '',
            3: '',
            4: '',
            5: '',
            6: '',
            7: '',
            8: '',
        },
        turn: true, // boolean; // true = player 1 (X), false = player 2 (O)
	}

	constructor(
		private websocketService: TictactoeService
	) {

	}

	ngOnInit(): void {
		// socket listeners
		this.handleGameState();
		this.handleGameOver();
		this.handleGameCode();
		this.handleInit();
		this.handleTooManyPlayers();
		this.handleUnknownGame();
		this.handleOnlineCount();
        this.handleRematchCount();
        this.chooseSquare(this.squareID);

		// html document values 
		this.gameScreen = document.querySelector('#gameScreen');
		this.initialScreen = document.querySelector('#initialScreen');
		this.newGameButton = document.querySelector('#newGameButton');
		this.joinGameButton = document.querySelector('#joinGameButton');
		this.gameCodeInput = document.querySelector('#gameCodeInput');
		this.gameCodeDisplay = document.querySelector('#gameCodeDisplay');
		this.rematchButton = document.querySelector('#rematchButton');
        this.tictactoeHomeButton = document.querySelector('#tictactoeHomeButton');
		this.newGameButton.addEventListener('click', this.newGame.bind(this));
		this.joinGameButton.addEventListener('click', this.joinGame.bind(this));
		this.rematchButton.addEventListener('click', this.rematch.bind(this));
        this.tictactoeHomeButton.addEventListener('click', this.tictactoeHome.bind(this));
        
        const squares = Array.from(document.getElementsByClassName('square'));
        for (let i = 0; i < 9; i++) {
            squares[i].addEventListener('click', this.chooseSquare.bind(this, i));
        }
	}

	newGame() {
		this.websocketService.tictactoeNewGame();
		this.init();
	}

	joinGame() {
		const code = this.gameCodeInput.value;
		this.gameCode = this.gameCodeInput.value;
		this.websocketService.tictactoeJoinGame(code.toString());
		this.init();
    }
    
    chooseSquare(id: number) {
		if (this.gameWinnerMessage !== "" && this.gameWinnerMessage !== "CAT!") {
			// if user clicks after game is over, this disallows that user from placing another character and potentially winning again
			this.currentText = "Game Over - Click for rematch";
		} else if (this.playerNumber === 1 && this.gameState.turn === false || this.playerNumber === 2 && this.gameState.turn === true) {
            // checks to only allow player whose turn it is to click ie if turn is true then it is player 1's turn and not player 2
			this.currentText = "Not your turn yet!";
        } else if (this.gameState.board[id] === 'X' || this.gameState.board[id] === 'O') {
            // space already taken
			this.currentText = "Space already taken";
        } else if (this.currentText === "waiting for player 2 to join") {
			// do nothing
		} else {
			// now calls tictactoeChooseSquare to process allowable square click
            this.websocketService.tictactoeChooseSquare(id, this.gameState.turn);
        }

    }

	rematch() {
		if (this.rematchButtonDisabled === false) {
			this.websocketService.tictactoeSendRematchEvent(this.gameCode, this.gameState.turn);
		}
	}

	tictactoeHome() {
		window.location.reload();
	}

	init() {
		this.initialScreen.style.display = 'none';
		this.gameScreen.style.display = 'block';
		this.gameWinnerMessage = "";
		this.gameActive = true;
	}

	handleInit() {
		this.websocketService.tictactoeInit().subscribe(data => {
            this.playerNumber = data['playerNumber'];
			this.playerText = this.playerNumber === 1 ? 'X' : 'O';
			this.currentText = "waiting for player 2 to join"; // this gets checked to make sure P1(X) does not chooseSquare before P2 joins
		});
	}

	handleGameState() {
		this.websocketService.tictactoeGamestate().subscribe(data => {
			this.gameState.board = data['board'];
			this.gameState.turn = data['turn'];
            for (var i = 0; i < 9; i++) {
                document.getElementById(i.toString()).innerHTML = this.gameState.board[i];
            }
            this.currentText = this.gameState.turn ? 'X' : 'O';
		})
	}

	handleGameOver() {
		this.websocketService.tictactoeGameOver().subscribe(data => {
			if (parseInt(data["winner"]) === -1) {
				this.gameWinnerMessage = "CAT!";
            } else if (this.playerNumber === parseInt(data['winner'])) {
				this.gameWinnerMessage = "You Win!";
				this.playerWins++;
            } else {
				this.gameWinnerMessage = "You Lose";
				this.playerLosses++;
            }
            
			this.gameActive = false;
			this.rematchButtonDisabled = false;
			this.tictactoeHomeButtonDisabled = false;
			this.stateReceived = false;
		})
	}

	handleGameCode() {
		this.websocketService.tictactoeGameCode().subscribe(data => {
			this.gameCodeDisplay.innerText = data['gameCode'];
			this.gameCode = data['gameCode'];
		})
	}

	handleUnknownGame() {
		this.websocketService.tictactoeUnknownGame().subscribe(data => {
			this.reset();
			alert('Unknown game code');
		})
	}

	handleTooManyPlayers() {
		this.websocketService.tictactoeTooManyPlayers().subscribe(data => {
			this.reset();
			alert('This game is already in progress');
		})
	}

	handleOnlineCount() {
		this.websocketService.tictactoeOnlineCount().subscribe(data => {
			this.onlineCount = parseInt(data['rematchCount']);
		})
	}

	handleRematchCount() {
		this.websocketService.tictactoeRematchCount().subscribe(data => {
			this.rematchCount = parseInt(data['rematchCount']);
			if (this.rematchCount === 2) {
				this.rematchCount = 0;
				this.rematchButtonDisabled = true;
				this.tictactoeHomeButtonDisabled = true;
				//this.currentText = this.gameState.turn ? 'X' : 'O';
				this.init();
			}
		});
	}

	reset() {
		this.playerNumber = null;
		this.gameCodeInput.value = "";
		this.gameCodeDisplay.innerText = "";
		this.initialScreen.style.display = "block";
		this.gameScreen.style.display = "none";
	}
}
