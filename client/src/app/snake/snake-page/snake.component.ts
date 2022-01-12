import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { SnakeService } from '../services/snake.service';

@Component({
	selector: 'app-snake',
	templateUrl: './snake.component.html',
	styleUrls: ['./snake.component.css'],
})
export class SnakeComponent implements OnInit {
	BG_COLOR = '#231f20';
	FOOD_COLOR = '#e66916';

	colorPickerDisabled = false;
	playerColor: string = `#${Math.floor(Math.random() * 16777215).toString(16)}`

	counter: any;
	gameScreen: any;
	gameActive = false;
	stateReceived: boolean = false;
	initialScreen: any;
	newGameButton: any;
	joinGameButton: any;
	rematchButton: any;
	snakeHomeButton: any;
	gameCodeInput: any;
	gameCodeDisplay: any;
	canvas: any;
	ctx: any;
	gameCode: string;
	playerNumber: any;
	rematchCount: number = 0;
	gameWinnerMessage: any;
	rematchButtonDisabled: boolean = true;
	snakeHomeButtonDisabled: boolean = true;
	onlineCount: number;
	gameCount: number;
	gameState = {
		player: {
			pos: {
				x: 3,
				y: 10
			},
			vel: {
				x: 1,
				y: 0
			},
			snake: [
				{ x: 1, y: 10 },
				{ x: 2, y: 10 },
				{ x: 3, y: 10 },
			]
		},
		food: {
			x: 7,
			y: 7
		},
		gridSize: 20
	}

	constructor(
		private websocketService: SnakeService
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
		this.snakeHomeButton = document.querySelector('#snakeHomeButton');
		this.counter = document.querySelector('#countdown');
		this.newGameButton.addEventListener('click', this.newGame.bind(this));
		this.joinGameButton.addEventListener('click', this.joinGame.bind(this));
		this.rematchButton.addEventListener('click', this.rematch.bind(this));
		this.snakeHomeButton.addEventListener('click', this.snakeHome.bind(this));
	}

	newGame() {
		this.websocketService.snakeNewGame(this.playerColor);
		this.init();
	}

	joinGame() {
		const code = this.gameCodeInput.value;
		this.gameCode = this.gameCodeInput.value;
		this.websocketService.snakeJoinGame(code.toString(), this.playerColor);
		this.init();
	}

	rematch() {
		if (this.rematchButtonDisabled === false) {
			this.websocketService.snakeSendRematchEvent(this.gameCode, this.playerColor);
		}
	}

	snakeHome() {
		window.location.reload();
	}

	paintGame(state) {
		;
		this.ctx.fillStyle = this.BG_COLOR;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		const food = state.food;
		const gridSize = state.gridSize;
		const size = this.canvas.width / gridSize;

		this.ctx.fillStyle = this.FOOD_COLOR;
		this.ctx.fillRect(food.x * size, food.y * size, size, size);


		this.paintPlayer(state.players[0], size, state.players[0].color || 'green');
		this.paintPlayer(state.players[1], size, state.players[1].color || 'red');
	}

	paintPlayer(playerState, size, color) {
		const snake = playerState.snake;

		this.ctx.fillStyle = color;
		for (let cell of snake) {
			this.ctx.fillRect(cell.x * size, cell.y * size, size, size);
		}
	}

	init() {
		this.initialScreen.style.display = 'none';
		this.gameScreen.style.display = 'block';
		this.gameWinnerMessage = "";

		this.canvas = document.querySelector('#canvas');
		this.ctx = this.canvas.getContext('2d');

		this.canvas.width = this.canvas.height = 600;
		this.ctx.fillStyle = this.BG_COLOR;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		document.addEventListener('keydown', this.keydown.bind(this));
		this.gameActive = true;
	}

	keydown(e) {
		this.websocketService.keyDownEvent(parseInt(e.keyCode))
	}

	handleInit() {
		this.websocketService.snakeInit().subscribe(data => {
			this.playerNumber = data['playerNumber'];
		});
	}

	handleGameState() {
		this.websocketService.snakeGamestate().subscribe(data => {
			// the first state response is received, start countdown
			if (!this.stateReceived) {
				this.stateReceived = true;
				this.gameWinnerMessage = "";
				let secondsCounter = 4;
				const intervalId = setInterval(() => {
					const nextValue = --secondsCounter;
					if (nextValue === 0) {
						clearInterval(intervalId);
					}

					requestAnimationFrame(() => {
						this.counter.textContent = nextValue === 0 ? 'Go!' : nextValue;
						this.counter.classList.remove('gamescreen-countdown-big');
						requestAnimationFrame(() => {
							this.counter.classList.add('gamescreen-countdown-big');
						});
					});
				}, 750)
				// start countdown
			}

			requestAnimationFrame(() => this.paintGame(data))
		})
	}

	handleGameOver() {
		this.websocketService.snakeGameOver().subscribe(data => {
			if (this.playerNumber === parseInt(data['winner'])) {
				this.gameWinnerMessage = "You Win!";
			}
			else {
				this.gameWinnerMessage = "You Lose";
			}

			this.gameActive = false;
			this.rematchButtonDisabled = false;
			this.snakeHomeButtonDisabled = false;
			this.stateReceived = false;
		})
	}

	handleGameCode() {
		this.websocketService.snakeGameCode().subscribe(data => {
			this.gameCodeDisplay.innerText = data['gameCode'];
			this.gameCode = data['gameCode'];
		})
	}

	handleUnknownGame() {
		this.websocketService.snakeUnknownGame().subscribe(data => {
			this.reset();
			alert('Unknown game code');
		})
	}

	handleTooManyPlayers() {
		this.websocketService.snakeTooManyPlayers().subscribe(data => {
			this.reset();
			alert('This game is already in progress');
		})
	}

	handleOnlineCount() {
		this.websocketService.snakeOnlineCount().subscribe(data => {
			this.onlineCount = parseInt(data['rematchCount']);
		})
	}

	handleRematchCount() {
		this.websocketService.snakeRematchCount().subscribe(data => {
			this.rematchCount = parseInt(data['rematchCount'])
			if (this.rematchCount === 2) {
				this.rematchCount = 0;
				this.rematchButtonDisabled = true;
				this.snakeHomeButtonDisabled = true;
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
