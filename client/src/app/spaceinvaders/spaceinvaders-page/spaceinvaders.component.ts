import { state } from '@angular/animations';
import { CONTEXT_NAME } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit, ViewContainerRef, ɵAPP_ID_RANDOM_PROVIDER } from '@angular/core';
import { SpaceinvadersService } from '../services/spaceinvaders.service';

@Component({
	selector: 'app-spaceinvaders',
	templateUrl: './spaceinvaders.component.html',
	styleUrls: ['./spaceinvaders.component.css'],
})
export class SpaceinvadersComponent implements OnInit {

	gameScreen: any;
	gameActive = false;
	stateReceived: boolean = false;
	initialScreen: any;
	newGameButton: any;
	joinGameButton: any;
	rematchButton: any;
	spaceinvadersHomeButton: any;
	gameCodeInput: any;
	gameCodeDisplay: any;
	gameCode: string;
	playerNumber: any;
	rematchCount: number = 0;
	gameWinnerMessage: any;
	rematchButtonDisabled: boolean = true;
	spaceinvadersHomeButtonDisabled: boolean = true;
	onlineCount: number;
	gameCount: number;
	canvas: any;
	wave: number = 0;
	alienDistanceX: number = 0; // keeps track of incremental alien movement side to side
	alienDistanceY: number = 0; // keeps track of incremental alien movement downward
	alienDirection: boolean = true; // true for right, false for left
	alienCounter: number = 0; // used to keep track of aliens downward distance
	alienMissileCounter: number = 0; // used to keep track of time since last alien missile
	alienDistanceXIncrementor: number = 1; // used to move aliens left and right at this rate
	alienDistanceYIncrementor: number = 1; // used to move aliens downward at this rate
	alienRateOfFire: number = 40; // this is the number of frames that skip between next alien shot and is directly related to number of frames per second
	teamScore: number = 0;
	highScore: number = 0;
	ctx: any;
	gameState = {
		heroSize: 40,
		alienSize: 25,
		hero: { // hero 1 / player 1
				pos: {
					x: 0,
					y: 0,
				},
				alive: true,
				missile: {
					x: 0,
					y: 0,
				},
			},
		aliens: { 
			// alien type in each array // 'D' for dead // 'R' for regular alien
			1: ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
			2: ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
			3: ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
			4: ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
			5: ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
		}
	}

	constructor(
		private websocketService: SpaceinvadersService
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
        this.spaceinvadersHomeButton = document.querySelector('#spaceinvadersHomeButton');
		this.newGameButton.addEventListener('click', this.newGame.bind(this));
		this.joinGameButton.addEventListener('click', this.joinGame.bind(this));
		this.rematchButton.addEventListener('click', this.rematch.bind(this));
        this.spaceinvadersHomeButton.addEventListener('click', this.spaceinvadersHome.bind(this));
		
	}

	newGame() {
		this.websocketService.spaceinvadersNewGame();
		this.init();
	}

	joinGame() {
		const code = this.gameCodeInput.value;
		this.gameCode = this.gameCodeInput.value;
		this.websocketService.spaceinvadersJoinGame(code.toString());
		this.init();
		this.wave++;
    }

	rematch() {
		if (this.rematchButtonDisabled === false) {
			this.websocketService.spaceinvadersSendRematchEvent(this.gameCode);
		}
	}

	spaceinvadersHome() {
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
		
		this.gameState.heroSize = this.canvas.width / 20;
		this.gameState.alienSize = this.canvas.width / 25;

		document.addEventListener('keydown', this.keydown.bind(this));
	}

	keydown(e) {
		if (this.gameActive === true) {
			this.websocketService.keyDownEvent(parseInt(e.keyCode));
		}
	}

	handleInit() {
		this.websocketService.spaceinvadersInit().subscribe(data => {
			this.playerNumber = data['playerNumber'];

			// initialize correct hero positioning
			this.gameState.hero.pos.x = (this.canvas.width / 2) - (this.gameState.heroSize / 2);
			
			// display heros
			const heroImage = new Image();
		
			heroImage.src = "../../../assets/img/space-invaders/hero.png";
			heroImage.onload = () => {
				// TODO maybe instead of displaying heros, display text to "waiting for other player" then "press spacebar to begin" or something
				this.gameState.hero.pos.y = this.canvas.height - this.gameState.heroSize;
				this.ctx.drawImage(heroImage, this.gameState.hero.pos.x, this.gameState.hero.pos.y, this.gameState.heroSize, this.gameState.heroSize);
				this.gameState.hero.pos.y = this.canvas.height - (this.gameState.heroSize * 2);
				this.ctx.drawImage(heroImage, this.gameState.hero.pos.x, this.gameState.hero.pos.y, this.gameState.heroSize, this.gameState.heroSize);
			}


		});

	}

	handleGameState() {
		this.websocketService.spaceinvadersGamestate().subscribe(data => {
			// paint game to canvas
			this.paintGame(data);
		})
	}

	paintGame(state) {
		// update game state properties
		this.gameState.hero = state.heros[this.playerNumber - 1];
		this.gameState.aliens = state.aliens;
		this.gameState.alienSize = state.alienSize;
		this.gameState.heroSize = state.heroSize;
		this.teamScore = state.teamScore;

		const heroImage = new Image();
		heroImage.src = "../../../assets/img/space-invaders/hero.png";
		// BACKGROUND IMAGE MAKES HEROS DISSAPPEAR FOR SOME REASON
		// const backgroundImage = new Image();
		// backgroundImage.src = "../../../assets/img/space-invaders/spacebackground.png";
		// backgroundImage.onload = () => {
		// 	this.ctx.drawImage(backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
		// }
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		heroImage.onload = () => {
			// draw heros
			if (state.heros[0].alive) {
				this.ctx.drawImage(heroImage, state.heros[0].pos.x, state.heros[0].pos.y, this.gameState.heroSize, this.gameState.heroSize);
			}
			if (state.heros[1].alive) {
				this.ctx.drawImage(heroImage, state.heros[1].pos.x, state.heros[1].pos.y, this.gameState.heroSize, this.gameState.heroSize);
			}
		}

		// draw missile			
		this.drawMissile(state.heros[0].missile, state.heros[1].missile, state.heroSize);

		this.alienMissileCounter++;
		
		// draw aliens
		const image_spacer = this.canvas.width / 16;
		const regularAlienImage = new Image();
		regularAlienImage.src = "../../../assets/img/space-invaders/regular.png";
		const superAlienImage = new Image();
		superAlienImage.src = "../../../assets/img/space-invaders/super.png";
		regularAlienImage.onload = () => {
			superAlienImage.onload = () => {
				for (let i = 1; i < 6; i++) {
					for (let j = 0; j < 10; j++) {
						if (this.gameState.aliens[i][j] === 'R') { // check for alien type
							this.ctx.drawImage(regularAlienImage, j*image_spacer+((this.canvas.width - 10*image_spacer) / 2) + this.alienDistanceX, i*image_spacer + this.alienDistanceY, this.gameState.alienSize, this.gameState.alienSize);
							// check if aliens passed heros and successfully invaded resulting in game over
							if (i*image_spacer + this.alienDistanceY > this.canvas.height) {
								this.aliensWin(); // tells server to call game over
							}
							// check if hero missile hits alien
							if ((this.gameState.hero.missile.x > (j*image_spacer+((this.canvas.width - 10*image_spacer) / 2) + this.alienDistanceX - this.gameState.alienSize - 5) && this.gameState.hero.missile.x < (j*image_spacer+((this.canvas.width - 10*image_spacer) / 2) + this.alienDistanceX + 5)) && (this.gameState.hero.missile.y < (i*image_spacer + this.alienDistanceY + this.gameState.alienSize) && (this.gameState.hero.missile.y > i*image_spacer + this.alienDistanceY))) {
								// call function to eliminate alien from json alien array and pass in player so their missile can be reset
								this.eliminateAlien(i, j, this.playerNumber - 1);
							}
						} else if (this.gameState.aliens[i][j] === 'S') { // check for alien type
							this.ctx.drawImage(superAlienImage, j*image_spacer+((this.canvas.width - 10*image_spacer) / 2) + this.alienDistanceX, i*image_spacer + this.alienDistanceY, this.gameState.alienSize, this.gameState.alienSize);
							// check if aliens passed heros and successfully invaded resulting in game over
							if (i*image_spacer + this.alienDistanceY > this.canvas.height) {
								this.aliensWin(); // tells server to call game over
							}
							// check if hero missile hits alien
							if ((this.gameState.hero.missile.x > (j*image_spacer+((this.canvas.width - 10*image_spacer) / 2) + this.alienDistanceX - this.gameState.alienSize - 5) && this.gameState.hero.missile.x < (j*image_spacer+((this.canvas.width - 10*image_spacer) / 2) + this.alienDistanceX + 5)) && (this.gameState.hero.missile.y < (i*image_spacer + this.alienDistanceY + this.gameState.alienSize) && this.gameState.hero.missile.y > i*image_spacer + this.alienDistanceY)) {
								this.eliminateAlien(i, j, this.playerNumber - 1);
							}
						} else {
							// this means the location value is 'D' or some other character and should not be displayed because alien is eliminated
						}
						// alien x and y missile
						let randomNum = Math.floor(Math.random() * 10);
						if (this.alienMissileCounter === this.alienRateOfFire && randomNum === j) {
							this.alienMissileCounter = 0;
							if (this.gameState.aliens[5][randomNum] !== 'D') {
								// fire missile
								this.fireAlienMissile(j*image_spacer+((this.canvas.width - 10*image_spacer) / 2) + this.alienDistanceX, 5*image_spacer + this.alienDistanceY);
							} else if (this.gameState.aliens[4][randomNum] !== 'D') {
								// fire missile
								this.fireAlienMissile(j*image_spacer+((this.canvas.width - 10*image_spacer) / 2) + this.alienDistanceX, 4*image_spacer + this.alienDistanceY);
							} else if (this.gameState.aliens[3][randomNum] !== 'D') {
								// fire missile
								this.fireAlienMissile(j*image_spacer+((this.canvas.width - 10*image_spacer) / 2) + this.alienDistanceX, 3*image_spacer + this.alienDistanceY);
							} else if (this.gameState.aliens[2][randomNum] !== 'D') {
								// fire missile
								this.fireAlienMissile(j*image_spacer+((this.canvas.width - 10*image_spacer) / 2) + this.alienDistanceX, 2*image_spacer + this.alienDistanceY);
							} else if (this.gameState.aliens[1][randomNum] !== 'D') {
								// fire missile
								this.fireAlienMissile(j*image_spacer+((this.canvas.width - 10*image_spacer) / 2) + this.alienDistanceX, 1*image_spacer + this.alienDistanceY);
							}
						} else if (this.alienMissileCounter > this.alienRateOfFire) {
							console.log(this.alienMissileCounter);
							this.alienMissileCounter = 0;
						}
					}
				}

				// draw alien missiles
				this.drawAlienMissiles(state.alienMissiles);

				// check where aliens at and call switchAlienFlow() function if they hit the edge
				if (this.alienDistanceX < ((this.canvas.width - 10*image_spacer) / 2) && this.alienDistanceX > ((this.canvas.width - 10*image_spacer) / 2 * -1)) {
					this.alienDistanceX = this.alienDirection ? this.alienDistanceX + this.alienDistanceXIncrementor : this.alienDistanceX - this.alienDistanceXIncrementor;
				} else {
					this.switchAlienFlow();
				}
			}
		}
	}


	eliminateAlien(row: number, col: number, pNum: number) {
		this.websocketService.spaceinvadersEliminateAlien(row, col, pNum, this.gameCode);
	}

	fireAlienMissile(missileX: number, missileY: number) {
		this.websocketService.spaceinvadersFireAlienMissile(missileX, missileY, this.gameCode);
	}

	aliensWin() {
		this.websocketService.spaceinvadersAliensWin(this.gameCode);
	}

	switchAlienFlow() {
		// increment counter 
		this.alienCounter++;
		// add to Y alien coordinate
		this.alienDistanceY += this.alienDistanceYIncrementor;
		// change direction from down to opposite of previous direction	
		if (this.alienCounter === 20) {
			this.alienCounter = 0; // reset counter
			this.alienDirection = !this.alienDirection; // switch direction
			this.alienDistanceX = this.alienDirection ? this.alienDistanceX + this.alienDistanceXIncrementor : this.alienDistanceX - this.alienDistanceXIncrementor;
		}
	}

	drawMissile(hero1Missile, hero2Missile, heroSize) {
		const missileImage = new Image();
		missileImage.src = "../../../assets/img/space-invaders/missile.png";
		missileImage.onload = () => {
			this.ctx.drawImage(missileImage, hero1Missile.x + (heroSize / 4), hero1Missile.y - (heroSize / 3), 20, 20);
			this.ctx.drawImage(missileImage, hero2Missile.x + (heroSize / 4), hero2Missile.y - (heroSize / 3), 20, 20);
		}
	}

	drawAlienMissiles(missiles) {
		const alienMissile = new Image();
		alienMissile.src = "../../../assets/img/space-invaders/alienmissile.png";
		alienMissile.onload = () => {
			for (let i = 1; i < 6; i++) {
				this.ctx.drawImage(alienMissile, missiles[i].x, missiles[i].y, 30, 30);
				this.ctx.drawImage(alienMissile, missiles[i].x, missiles[i].y, 30, 30);
				this.ctx.drawImage(alienMissile, missiles[i].x, missiles[i].y, 30, 30);
				this.ctx.drawImage(alienMissile, missiles[i].x, missiles[i].y, 30, 30);
				this.ctx.drawImage(alienMissile, missiles[i].x, missiles[i].y, 30, 30);
			}
		}
	}

	handleGameOver() {
		this.websocketService.spaceinvadersGameOver().subscribe(data => {
			// display game over
			if (parseInt(data["winner"]) === 0) {
				this.ctx.font = "36px Courier";
				this.ctx.fillStyle = "#39ff14";
				this.ctx.textAlign = "center";
				this.ctx.fillText("GAME OVER!  Score = " + this.teamScore, this.canvas.width / 2, this.canvas.height / 2);
			}
			if (parseInt(data["winner"]) === 0) {
				this.gameActive = false;
				this.rematchButtonDisabled = false;
				this.spaceinvadersHomeButtonDisabled = false;
				this.stateReceived = false;
			} else if (parseInt(data["winner"]) === 1) {
				this.wave++;
				// reset aliens to top of screen using these variables
				this.alienDistanceX = 0;
				this.alienDistanceY = 0;
				// increase alien speed per frame based on wave number
				this.alienDistanceXIncrementor = 1 + (this.wave / 8);
				// reset alien missiles
				
			}
			// this.gameActive = false;
			// this.rematchButtonDisabled = false;
			// this.spaceinvadersHomeButtonDisabled = false;
			// this.stateReceived = false;
		})
	}

	// handleNewWave() { // MOVED THIS CODE TO EMIT GAME OVER BECAUSE I WAS HAVING MAJOR ISSUES with it not calling the function in index.js
	// 	this.websocketService.spaceinvadersEmitNewWave().subscribe(data => {
	// 		console.log("call emit new wave");
	// 		let clientNum = data["num"];
	// 		this.wave++;
	// 		// reset aliens to top of screen using these variables
	// 		this.alienDistanceX = 0;
	// 		this.alienDistanceY = 0;
	// 		// increase alien speed per frame based on wave number
	// 		this.alienDistanceXIncrementor = 1 + (this.wave / 10);
	// 		this.alienDistanceYIncrementor = 1;
	// 	})
	// }

	handleGameCode() {
		this.websocketService.spaceinvadersGameCode().subscribe(data => {
			this.gameCodeDisplay.innerText = data['gameCode'];
			this.gameCode = data['gameCode'];
		})
	}

	handleUnknownGame() {
		this.websocketService.spaceinvadersUnknownGame().subscribe(data => {
			this.reset();
			alert('Unknown game code');
		})
	}

	handleTooManyPlayers() {
		this.websocketService.spaceinvadersTooManyPlayers().subscribe(data => {
			this.reset();
			alert('This game is already in progress');
		})
	}

	handleOnlineCount() {
		this.websocketService.spaceinvadersOnlineCount().subscribe(data => {
			this.onlineCount = parseInt(data['rematchCount']);
		})
	}

	handleRematchCount() {
		this.websocketService.spaceinvadersRematchCount().subscribe(data => {
			this.rematchCount = parseInt(data['rematchCount']);
			if (this.rematchCount === 2) {
				this.rematchCount = 0;
				this.rematchButtonDisabled = true;
				this.spaceinvadersHomeButtonDisabled = true;
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