import { state } from '@angular/animations';
import { CONTEXT_NAME } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit, ViewContainerRef, ɵAPP_ID_RANDOM_PROVIDER } from '@angular/core';
import { PongService } from '../services/pong.service';

@Component({
	selector: 'app-pong',
	templateUrl: './pong.component.html',
	styleUrls: ['./pong.component.css'],
})
export class PongComponent implements OnInit {

	gameScreen: any;
	gameActive = false;
	stateReceived: boolean = false;
	initialScreen: any;
	newGameButton: any;
	joinGameButton: any;
	rematchButton: any;
	pongHomeButton: any;
	gameCodeInput: any;
	gameCodeDisplay: any;
	gameCode: string;
	playerNumber: any;
	rematchCount: number = 0;
	gameWinnerMessage: any;
	rematchButtonDisabled: boolean = true;
	pongHomeButtonDisabled: boolean = true;
	onlineCount: number;
	gameCount: number;

    paddleWidth: number = 20;
    paddleHeight: number = 100;


	canvas: any;
	

	ctx: any;
	gameState = {
        players: {
            1: {
                y: 0,
                score: 0,
            },
            2: {
                y: 0,
                score: 0,
            },
        },
        ball: {
            x: 400,
            y: 275,
            speedX: 5,
            speedY: 5,
        },
        screenWidth: 800,
        screenHeight: 550,
	}

	constructor(
		private websocketService: PongService
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
        this.pongHomeButton = document.querySelector('#pongHomeButton');
		this.newGameButton.addEventListener('click', this.newGame.bind(this));
		this.joinGameButton.addEventListener('click', this.joinGame.bind(this));
		this.rematchButton.addEventListener('click', this.rematch.bind(this));
        this.pongHomeButton.addEventListener('click', this.pongHome.bind(this));
	}

	newGame() {
		this.websocketService.pongNewGame();
		this.init();
	}

	joinGame() {
		const code = this.gameCodeInput.value;
		this.gameCode = this.gameCodeInput.value;
		this.websocketService.pongJoinGame(code.toString());
		this.init();
    }

	rematch() {
		if (this.rematchButtonDisabled === false) {
			this.websocketService.pongSendRematchEvent(this.gameCode);
		}
	}

	pongHome() {
		window.location.reload();
	}

	init() {
		this.initialScreen.style.display = 'none';
		this.gameScreen.style.display = 'block';
		this.gameWinnerMessage = "";
		this.gameActive = true;

		this.canvas = document.querySelector('#canvas');
		this.ctx = this.canvas.getContext('2d');

        // initialize screen sizes according to gameState
		this.canvas.width = this.gameState.screenWidth;
		this.canvas.height = this.gameState.screenHeight;

        // fill screen
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // display message
        this.ctx.fillStyle = "white";
        this.ctx.font = "42px monospace";
        this.ctx.fillText("Waiting for other player...", 50, 100);

        // listen to player movement
		document.addEventListener('keydown', this.keydown.bind(this));
	}

	keydown(e) {
		if (this.gameActive === true) {
			console.log("keydown called");
			this.websocketService.keyDownEvent(parseInt(e.keyCode));
		}
	}

	handleInit() {
		this.websocketService.pongInit().subscribe(data => {
			this.playerNumber = data['playerNumber'];

		});

	}

	handleGameState() {
		this.websocketService.pongGamestate().subscribe(data => {
			// paint game to canvas
			this.paintGame(data);
		})
	}

	paintGame(state) {
		// draw background
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.gameState = state;

        // draw paddles
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(10, this.gameState.players[1].y, this.paddleWidth, this.paddleHeight);
        this.ctx.fillRect(this.canvas.width - (this.paddleWidth + 10), this.gameState.players[2].y, this.paddleWidth, this.paddleHeight);

        // draw scoreboard
        this.ctx.textBaseline = "top";
        this.ctx.textAlign = "center";
        this.ctx.font = "52px monospace";
        this.ctx.fillText(this.gameState.players[1].score + " | " + this.gameState.players[2].score, this.gameState.screenWidth / 2, 0);

        // draw ball
        this.ctx.beginPath();
        this.ctx.arc(this.gameState.ball.x, this.gameState.ball.y, 13, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.closePath();
	}


	handleGameOver() {
		this.websocketService.pongGameOver().subscribe(data => {
            // display game over
            this.ctx.font = "52px Courier";
			this.ctx.fillStyle = "white";
			this.ctx.textAlign = "center";
            // check which player won
			if (this.playerNumber === parseInt(data["winner"])) {
				this.ctx.fillText("You Win!", this.gameState.screenWidth / 2, this.gameState.screenHeight - 100);
			} else {
				this.ctx.fillText("You Lose!", this.gameState.screenWidth / 2, this.gameState.screenHeight - 100);
            }
			
			this.gameActive = false;
			this.rematchButtonDisabled = false;
			this.pongHomeButtonDisabled = false;
			this.stateReceived = false;
		})
	}

	handleGameCode() {
		this.websocketService.pongGameCode().subscribe(data => {
			this.gameCodeDisplay.innerText = data['gameCode'];
			this.gameCode = data['gameCode'];
		})
	}

	handleUnknownGame() {
		this.websocketService.pongUnknownGame().subscribe(data => {
			this.reset();
			alert('Unknown game code');
		})
	}

	handleTooManyPlayers() {
		this.websocketService.pongTooManyPlayers().subscribe(data => {
			this.reset();
			alert('This game is already in progress');
		})
	}

	handleOnlineCount() {
		this.websocketService.pongOnlineCount().subscribe(data => {
			this.onlineCount = parseInt(data['rematchCount']);
		})
	}

	handleRematchCount() {
		this.websocketService.pongRematchCount().subscribe(data => {
			console.log("rematch count");
			this.rematchCount = parseInt(data['rematchCount']);
			if (this.rematchCount === 2) {
				this.rematchCount = 0;
				this.rematchButtonDisabled = true;
				this.pongHomeButtonDisabled = true;
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