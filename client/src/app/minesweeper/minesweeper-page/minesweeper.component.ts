import { state } from '@angular/animations';
import { CONTEXT_NAME } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit, ViewContainerRef, ɵAPP_ID_RANDOM_PROVIDER } from '@angular/core';
import { MinesweeperService } from '../services/minesweeper.service';

@Component({
	selector: 'app-minesweeper',
	templateUrl: './minesweeper.component.html',
	styleUrls: ['./minesweeper.component.css'],
})
export class MinesweeperComponent implements OnInit {

	gameScreen: any;
	gameActive = false;
	stateReceived: boolean = false;
	initialScreen: any;
	newGameButton: any;
	joinGameButton: any;
	rematchButton: any;
	minesweeperHomeButton: any;
	gameCodeInput: any;
	gameCodeDisplay: any;
	gameCode: string;
	playerNumber: any;
	rematchCount: number = 0;
	gameWinnerMessage: any;
	rematchButtonDisabled: boolean = true;
	minesweeperHomeButtonDisabled: boolean = true;
	onlineCount: number;
	gameCount: number;

	currentTurn: string;
	timeLeft: number;

	gameState = {
        board: {

		},
		turn: true,
		time: 25,
	}

	constructor(
		private websocketService: MinesweeperService
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

		// html document values 
		this.gameScreen = document.querySelector('#gameScreen');
		this.initialScreen = document.querySelector('#initialScreen');
		this.newGameButton = document.querySelector('#newGameButton');
		this.joinGameButton = document.querySelector('#joinGameButton');
		this.gameCodeInput = document.querySelector('#gameCodeInput');
		this.gameCodeDisplay = document.querySelector('#gameCodeDisplay');
		this.rematchButton = document.querySelector('#rematchButton');
        this.minesweeperHomeButton = document.querySelector('#minesweeperHomeButton');
        
		this.newGameButton.addEventListener('click', this.newGame.bind(this));
		this.joinGameButton.addEventListener('click', this.joinGame.bind(this));
		this.rematchButton.addEventListener('click', this.rematch.bind(this));
        this.minesweeperHomeButton.addEventListener('click', this.minesweeperHome.bind(this));

		const squares = Array.from(document.getElementsByClassName('square'));
        for (let i = 1; i < 65; i++) {
            squares[i-1].addEventListener('click', this.chooseSquare.bind(this, i));
        }
	}

	newGame() {
		this.websocketService.minesweeperNewGame();
		this.init();
		this.currentTurn = "Waiting for other player...";
	}

	joinGame() {
		const code = this.gameCodeInput.value;
		this.gameCode = this.gameCodeInput.value;
		this.websocketService.minesweeperJoinGame(code.toString());
		this.init();
    }

	rematch() {
		if (this.rematchButtonDisabled === false) {
			this.websocketService.minesweeperSendRematchEvent(this.gameCode);
		}
	}

	minesweeperHome() {
		window.location.reload();
	}

	init() {
		this.initialScreen.style.display = 'none';
		this.gameScreen.style.display = 'block';
		this.gameWinnerMessage = "";
		this.gameActive = true;
	}

	chooseSquare(id: number) {
		if (this.currentTurn === "Waiting for other player...") {
			// continue waiting
		} else if (this.gameWinnerMessage !== "") {
			this.currentTurn = "Game Over! Click for rematch...";
		} else if (this.playerNumber === 1 && this.gameState.turn === false || this.playerNumber === 2 && this.gameState.turn === true) {
			this.currentTurn = "Not your turn yet...";
		} else if (this.gameState.board[id].hidden === false) {
			this.currentTurn = "Space already taken.";
		} else {
			this.websocketService.minesweeperChooseSquare(id, this.gameState.turn);
		}
    }

	handleInit() {
		this.websocketService.minesweeperInit().subscribe(data => {
			this.playerNumber = data['playerNumber'];
		});
	}

	handleGameState() {
		this.websocketService.minesweeperGamestate().subscribe(data => {
			this.gameState.board = data['board'];
			this.gameState.turn = data['turn'];
			this.gameState.time = data['time'];
			this.timeLeft = this.gameState.time;
			this.currentTurn = this.gameState.turn ? "Player 1" : "Player 2";
			// iterate through board to display values, UPDATE LATER: probably a better way to do this by only checking the square that was clicked
			for (var i = 1; i < 65; i++) {
				if (data['board'][i].hidden === false) {
					document.getElementById(i.toString()).innerHTML = this.gameState.board[i].val;
					if (document.getElementById(i.toString()).innerHTML === 'X') {
						// iterate through board to display all bombs
						for (let j = 1; j < 65; j++) {
							if (data['board'][j].val === 'X') {
								document.getElementById(j.toString()).style.backgroundColor = "red";
								document.getElementById(j.toString()).innerHTML = "X";
							}
						}
					} else {
						document.getElementById(i.toString()).style.backgroundColor = "white";
					}
				}
            }
		})
	}

	handleGameOver() {
		this.websocketService.minesweeperGameOver().subscribe(data => {
            // check which player won
			if (this.playerNumber === parseInt(data["winner"])) {
				this.gameWinnerMessage = "You Win!";
			} else {
				this.gameWinnerMessage = "You Lose!";
            }
			
			this.gameActive = false;
			this.rematchButtonDisabled = false;
			this.minesweeperHomeButtonDisabled = false;
			this.stateReceived = false;
		})
	}

	handleGameCode() {
		this.websocketService.minesweeperGameCode().subscribe(data => {
			this.gameCodeDisplay.innerText = data['gameCode'];
			this.gameCode = data['gameCode'];
		})
	}

	handleUnknownGame() {
		this.websocketService.minesweeperUnknownGame().subscribe(data => {
			this.reset();
			alert('Unknown game code');
		})
	}

	handleTooManyPlayers() {
		this.websocketService.minesweeperTooManyPlayers().subscribe(data => {
			this.reset();
			alert('This game is already in progress');
		})
	}

	handleOnlineCount() {
		this.websocketService.minesweeperOnlineCount().subscribe(data => {
			this.onlineCount = parseInt(data['rematchCount']);
		})
	}

	handleRematchCount() {
		this.websocketService.minesweeperRematchCount().subscribe(data => {
			this.rematchCount = parseInt(data['rematchCount']);
			if (this.rematchCount === 2) {
				this.rematchCount = 0;
				this.rematchButtonDisabled = true;
				this.minesweeperHomeButtonDisabled = true;
				this.init();
				for (let i = 1; i < 65; i++) {
					document.getElementById(i.toString()).style.backgroundColor = "gray";
					document.getElementById(i.toString()).innerHTML = '';
				}
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