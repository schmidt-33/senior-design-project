import { state } from '@angular/animations';
import { CONTEXT_NAME } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit, ViewContainerRef, ɵAPP_ID_RANDOM_PROVIDER } from '@angular/core';
import { SpaceraceService } from '../services/spacerace.service';

@Component({
	selector: 'app-spacerace',
	templateUrl: './spacerace.component.html',
	styleUrls: ['./spacerace.component.css'],
})
export class SpaceraceComponent implements OnInit {

	gameScreen: any;
	gameActive = false;
	stateReceived: boolean = false;
	initialScreen: any;
	newGameButton: any;
	joinGameButton: any;
	rematchButton: any;
	spaceraceHomeButton: any;
	gameCodeInput: any;
	gameCodeDisplay: any;
	gameCode: string;
	playerNumber: any;
	rematchCount: number = 0;
	gameWinnerMessage: any;
	rematchButtonDisabled: boolean = true;
	spaceraceHomeButtonDisabled: boolean = true;
	onlineCount: number;
	gameCount: number;
	canvas: any;

    middleBarrierSize: number = 200;
    rocketHeight: number = 35;
    rocketWidth: number = 25;
    gameMessage: string = "";

	ctx: any;
	gameState = {

	}

	constructor(
		private websocketService: SpaceraceService
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
        this.spaceraceHomeButton = document.querySelector('#spaceraceHomeButton');
		this.newGameButton.addEventListener('click', this.newGame.bind(this));
		this.joinGameButton.addEventListener('click', this.joinGame.bind(this));
		this.rematchButton.addEventListener('click', this.rematch.bind(this));
        this.spaceraceHomeButton.addEventListener('click', this.spaceraceHome.bind(this));
		
	}

	newGame() {
		this.websocketService.spaceraceNewGame();
		this.init();
	}

	joinGame() {
		const code = this.gameCodeInput.value;
		this.gameCode = this.gameCodeInput.value;
		this.websocketService.spaceraceJoinGame(code.toString());
		this.init();
    }

	rematch() {
		if (this.rematchButtonDisabled === false) {
			this.websocketService.spaceraceSendRematchEvent(this.gameCode);
		}
	}

	spaceraceHome() {
		window.location.reload();
	}

	init() {
		this.initialScreen.style.display = 'none';
		this.gameScreen.style.display = 'block';
		this.gameWinnerMessage = "";
		this.gameActive = true;

		this.canvas = document.querySelector('#canvas');
		this.ctx = this.canvas.getContext('2d');

		this.canvas.width = 700;
		this.canvas.height = 500;
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // draw middle barrier
        this.ctx.fillStyle = "white";
        this.ctx.fillRect((this.canvas.width / 2) - 5, this.canvas.height - this.middleBarrierSize, 10, this.middleBarrierSize);

        // draw scoreboard
        this.ctx.textBaseline = "bottom";
        this.ctx.textAlign = "center";
        this.ctx.font = "90px impact";
        this.ctx.fillText(0, this.canvas.width / 8, this.canvas.height);
        this.ctx.fillText(0, this.canvas.width / 8 * 7, this.canvas.height);

        // add message
        this.gameMessage = "Waiting for other player to join...";

		document.addEventListener('keydown', this.keydown.bind(this));
	}

	keydown(e) {
		if (this.gameActive === true) {
			this.websocketService.keyDownEvent(parseInt(e.keyCode));
		}
	}

	handleInit() {
		this.websocketService.spaceraceInit().subscribe(data => {
			this.playerNumber = data['playerNumber'];

		});

	}

	handleGameState() {
		this.websocketService.spaceraceGamestate().subscribe(data => {
			// paint game to canvas
			this.paintGame(data);
		})
	}

	paintGame(state) {
        this.gameMessage = "Go!";

		const rocket = new Image();
		rocket.src = "../../../assets/img/spacerace/rocket.png";

        // draw background
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.gameState = state;

        // draw middle barrier
        this.ctx.fillStyle = "white";
        this.ctx.fillRect((this.gameState["screen"].width / 2) - 5, this.gameState["screen"].height - this.middleBarrierSize, 10, this.middleBarrierSize);

        // draw scoreboard
        this.ctx.textBaseline = "bottom";
        this.ctx.textAlign = "center";
        this.ctx.font = "90px impact";
        this.ctx.fillText(this.gameState["score"]["1"], this.gameState["screen"].width / 8, this.gameState["screen"].height);
        this.ctx.fillText(this.gameState["score"]["2"], this.gameState["screen"].width / 8 * 7, this.gameState["screen"].height);

        // draw rockets
        rocket.onload = () => {
			this.ctx.drawImage(rocket, (this.gameState["screen"].width / 8) * 3, this.gameState["y"]["1"] - this.rocketHeight, this.rocketWidth, this.rocketHeight);
            this.ctx.drawImage(rocket, (this.gameState["screen"].width / 8) * 5 - this.rocketWidth, this.gameState["y"]["2"] - this.rocketHeight, this.rocketWidth, this.rocketHeight);
		}

        // draw asteroids projectiles
        this.ctx.fillStyle = "white";
        for (let i = 1; i <= 36; i++) {
            // console.log(this.gameState["asteroids"][i]["x"]);
            this.ctx.fillRect(this.gameState["asteroids"][i]["x"], this.gameState["asteroids"][i]["y"], 10, 4);
        }
		
	}

	handleGameOver() {
		this.websocketService.spaceraceGameOver().subscribe(data => {

            if (this.playerNumber === parseInt(data['winner'])) {
				this.gameWinnerMessage = "You Win!";
			}
			else {
				this.gameWinnerMessage = "You Lose";
			}
			this.gameActive = false;
			this.rematchButtonDisabled = false;
			this.spaceraceHomeButtonDisabled = false;
			this.stateReceived = false;
		})
	}


	handleGameCode() {
		this.websocketService.spaceraceGameCode().subscribe(data => {
			this.gameCodeDisplay.innerText = data['gameCode'];
			this.gameCode = data['gameCode'];
		})
	}

	handleUnknownGame() {
		this.websocketService.spaceraceUnknownGame().subscribe(data => {
			this.reset();
			alert('Unknown game code');
		})
	}

	handleTooManyPlayers() {
		this.websocketService.spaceraceTooManyPlayers().subscribe(data => {
			this.reset();
			alert('This game is already in progress');
		})
	}

	handleOnlineCount() {
		this.websocketService.spaceraceOnlineCount().subscribe(data => {
			this.onlineCount = parseInt(data['rematchCount']);
		})
	}

	handleRematchCount() {
		this.websocketService.spaceraceRematchCount().subscribe(data => {
			this.rematchCount = parseInt(data['rematchCount']);
			if (this.rematchCount === 2) {
				this.rematchCount = 0;
				this.rematchButtonDisabled = true;
				this.spaceraceHomeButtonDisabled = true;
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