import { Component, HostListener, OnInit } from '@angular/core';
import { WordListService } from 'src/app/shared/services/wordlist/wordlist.service';
import { HangmanService } from '../services/hangman.service';

@Component({
	selector: 'app-hangman-page',
	templateUrl: './hangman-page.component.html',
	styleUrls: ['./hangman-page.component.scss']
})

export class HangmanPageComponent implements OnInit {

	gameCode: string = '';

	onlineCount: number;
	wordListNames: string[] = [];
	gameState: any;
	socket: string;

	isWinner: boolean = false;
	isTiedGame: boolean = false;

	constructor(
		private hangmanService: HangmanService,
		private wordListService: WordListService,
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

		this.wordListService.getWordListNames().subscribe(
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

	handleGameState() {
		this.hangmanService.hangmanGameState().subscribe(data => {
			this.gameState = data;
			console.log(this.gameState);
		});
	}

	isGuesser() {
		return this.socket === this.gameState.guesser;
	}

	getChar(codeOffset) {
		return String.fromCharCode(65 + codeOffset);
	}

	tryGuess(letterIndex) {
		this.hangmanService.hangmanTryGuess(letterIndex);
	}

	newGame({ wordListName }) {
		console.log(wordListName);
		this.init();
		this.hangmanService.hangmanNewGame(wordListName);
	}

	joinGame() {
		if (!this.gameCode.length) {
			return;
		}
		this.init();
		this.hangmanService.hangmanJoinGame(this.gameCode);
	}

	init() {
		this.gameState = {};
	}

	handleInit() {
		this.hangmanService.hangmanInit().subscribe(data => {
			this.socket = data['socket'];
		});
	}

	handleGameCode() {
		this.hangmanService.hangmanGameCode().subscribe(data => {
			this.gameCode = data['gameCode'];
		});
	}

	handleUnknownGame() {
		this.hangmanService.hangmanUnknownGame().subscribe(data => {
			this.leaveGame();
			alert('Unknown game code');
		});
	}

	handleTooManyPlayers() {
		this.hangmanService.hangmanTooManyPlayers().subscribe(data => {
			this.leaveGame();
			alert('This game is already in progress');
		});
	}

	handleOnlineCount() {
		this.hangmanService.hangmanOnlineCount().subscribe(data => {
			this.onlineCount = parseInt(data['rematchCount']);
		});
	}

	handleRematchCount() {
		this.hangmanService.hangmanRematchCount().subscribe(data => {
			this.resetGame();
		});
	}

	handleGameOver() {
		this.hangmanService.hangmanGameOver().subscribe(data => {
			this.isWinner = data['winners'].includes(this.socket);
			this.isTiedGame = data['winners'].length > 1;
		});
	}

	leaveGame() {
		this.gameCode = "";
		delete this.gameState;
	}

	resetGame() {
	}

	rematch() {
		this.hangmanService.hangmanSendRematchEvent(this.gameCode);
	}

	@HostListener('document:keypress', ['$event'])
	handleKeyPress(event: KeyboardEvent) {
		const charOffset = event.key.toUpperCase().charCodeAt(0) - 65;
		const charIsAtoZ = charOffset >= 0 && charOffset <= 26;
		console.log(event.key, charOffset, charIsAtoZ);

		if (this.gameState && !this.gameState.gameOver && charIsAtoZ) {	
			this.tryGuess(charOffset);
		}	
	}

}
