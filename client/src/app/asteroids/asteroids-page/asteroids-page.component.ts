import { Component, OnInit } from '@angular/core';
import Game from './classes/single-player/game';
import MultiPlayerGame from './classes/multiplayer/game';
import { AsteroidsService } from '../services/asteroids.service';

@Component({
	selector: 'app-asteroids-page',
	templateUrl: './asteroids-page.component.html',
	styleUrls: ['./asteroids-page.component.css']
})
export class AsteroidsPageComponent implements OnInit {
	singlePlayerGame: Game;
	multiplayerGame: MultiPlayerGame;
	isSinglePlayerGame: boolean;
	isOnMenuScreen: boolean

	//? Multiplayer data fields
	roomCode: string;
	maxNumberOfPlayers: number = 2;
	allPlayersJoined: boolean = false;


	constructor(
		private websocketService: AsteroidsService
	) {
		this.isOnMenuScreen = true;
		this.roomCode = "";
	}

	ngOnInit(): void { }

	/* * * * * * * * * * * * *
	 * Single Player Events  *
	 * * * * * * * * * * * * */
	singlePlayerEvent() {
		this.isSinglePlayerGame = true;
		this.toggleGameScreens();
		this.singlePlayerGame = new Game(document.getElementById('singlePlayerGame'));
		this.singlePlayerGame.start();

		window.addEventListener("keydown", this.handleSinglePlayerKeyDown.bind(this));
		window.addEventListener("keyup", this.handleSinglePlayerKeyUp.bind(this));
	}

	handleSinglePlayerKeyDown = (e: KeyboardEvent) => {
		var keycode = e.which || e.keyCode;
		if (keycode === 37 || keycode === 38 || keycode === 39 || keycode === 40 || keycode === 32) {
			e.preventDefault();
		}

		this.singlePlayerGame.keyDown(keycode);
	}

	handleSinglePlayerKeyUp = (e: KeyboardEvent) => {
		var keycode = e.which || e.keyCode;
		this.singlePlayerGame.keyUp(keycode);
	}

	/* * * * * * * * * * * * *
	 *   Multiplayer Events  *
	 * * * * * * * * * * * * */
	handleMultiplayerNewGameEvent() {
		//? Web socket listeners
		this.handleGameCode();
		this.handleGameState();

		//? Key listeners
		// window.addEventListener("keydown", this.handleMultiplayerKeyDown.bind(this));
		// window.addEventListener("keyup", this.handleMultiplayerKeyUp.bind(this));

		this.isSinglePlayerGame = false;
		this.toggleGameScreens();
		//? Create game state here on server
		this.handleMultiplayerNewGame();
	}

	handleMultiplayerNewGame() {
		this.websocketService.newGame();
	}

	handleGameCode() {
		this.websocketService.roomCode().subscribe(data => {
			this.roomCode = data['roomCode'];
		});
	}

	handleGameState() {
		this.websocketService.gameState().subscribe(data => {
			console.log(data);
		});
	}



	handleMultiplayerKeyDown = (e: KeyboardEvent) => {
		if (this.isOnMenuScreen) return;

		var keycode = e.which || e.keyCode;
		if (keycode === 37 || keycode === 38 || keycode === 39 || keycode === 40 || keycode === 32) {
			e.preventDefault();
		}

		//TODO use websocket
	}

	handleMultiplayerKeyUp = (e: KeyboardEvent) => {
		if (this.isOnMenuScreen) return;
		var keycode = e.which || e.keyCode;
		if (keycode === 37 || keycode === 38 || keycode === 39 || keycode === 40 || keycode === 32) {
			e.preventDefault();
		}

		//TODO use websocket
	}

	multiplayerGameState() {
		// TODO listen for frame updates
	}

	toggleGameScreens() {
		const singlePlayerGameScreen: HTMLElement = document.querySelector('#singlePlayerGameScreen');
		const multiplayerGameScreen: HTMLElement = document.querySelector('#multiplayerGameScreen');
		const initialScreen: HTMLElement = document.querySelector('#initialScreen');
		if (this.isOnMenuScreen) {
			if (this.isSinglePlayerGame) {
				singlePlayerGameScreen.style.display = 'block';
				multiplayerGameScreen.style.display = 'none';
			}
			else {
				multiplayerGameScreen.style.display = 'block';
				singlePlayerGameScreen.style.display = 'none';
			}
			initialScreen.style.display = 'none';
			this.isOnMenuScreen = false;
		}
		else {
			initialScreen.style.display = 'block';
			singlePlayerGameScreen.style.display = 'none';
			multiplayerGameScreen.style.display = 'none';
			this.isOnMenuScreen = true;
		}
	}
}
