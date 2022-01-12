import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TriviaService } from 'src/app/trivia/services/trivia.service';
import { environment } from 'src/environments/environment';
import { TriviaCategory } from 'src/app/interfaces/trivia-category'
import UsernameGenerator from 'src/app/shared/username-generator/username-generator';
import { PlayerModalComponent } from 'src/app/shared/player-modal/player-modal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NavigationStart, NavigationEnd, Router } from '@angular/router';

//? Local Questions
import { ACGHistoryQuestions } from '../data/acg-history-questions';

//? Interfaces
import IPlayer from '../interfaces/player'
import IGameState from '../interfaces/game-state'
import Question from '../interfaces/question';

@Component({
	selector: 'app-trivia',
	templateUrl: './trivia.component.html',
	styleUrls: ['./trivia.component.css']
})
export class TriviaComponent implements OnInit, OnDestroy {
	//? user values
	username: string;
	playerNumber: number;

	//? game values
	gameState: IGameState;
	gameStatus: string = "preGame";
	previousGameStatus: IGameState;
	roomName: any;
	gameCodeUserInput: string;
	buttonReadyDisabled: boolean = false;
	selectAnswer: string = "";
	correctAnswer: string = "";
	questionNumber: number;
	secondsRemaining: number;
	questionSelected: boolean;
	numPlayers: number = 0;
	players: IPlayer[];
	categories: TriviaCategory[] = [];
	maxNumberOfPlayers: number = 15;
	minimumNumberOfPlayers: number = 2;
	maxNumberOfQuestions: number = 30;
	minimumNumberOfQuestions: number = 5;
	difficulty: string;
	categoryName: string;

	//? Display Values
	titleHeader: InnerHTML;
	gameExplanation: InnerHTML;
	gameWinnerName: string;
	gameWinnerScore: number;
	buttonLabel: string;


	//? Elements
	readyButton: HTMLElement;
	newGameButton: HTMLElement;
	joinGameButton: HTMLElement;
	initialGameScreen: HTMLElement;
	lobbyScreen: HTMLElement;
	gameScreen: HTMLElement;
	questionScreen: HTMLElement;
	gameOverScreen: HTMLElement;
	usernameInputField: HTMLInputElement;
	gameCodeInputField: HTMLInputElement;
	showCorrectAnswerElement: HTMLElement;


	constructor(
		private triviaService: TriviaService,
		private modalService: NgbModal,
		private http: HttpClient
	) {
		this.gameState = { questions: [], players: [], numPlayers: 0 }
	}

	ngOnInit(): void {
		try {
			console.log(`Run onInit`);
			//? Reconnect socket if disconnected
			this.triviaService.reconnectTriviaWebsocket();

			//? API calls
			this.getTriviaCategories();

			//? socket listeners
			this.handleJoinGame();
			this.handlePlayerLeaveGame();
			this.handleTooManyPlayers();
			this.handleUnknownGame();
			this.handleReadyUpEvent();
			this.handleQuestionCountDown();
			this.handlePostGame();
			this.handleScoreUpdate();

			//? elements
			this.initialGameScreen = document.querySelector('#initial-trivia-screen');
			this.lobbyScreen = document.querySelector('.lobby-screen');
			this.gameScreen = document.querySelector('.game-screen');
			this.questionScreen = document.querySelector('.question-screen');
			this.gameOverScreen = document.querySelector('.game-over-screen');

			//? Get username
			this.usernameInputField = document.querySelector('#usernameInput');
			//? Set random username
			this.generateRandomUsername();

			this.gameCodeInputField = document.querySelector('#gameCodeInput');
			this.showCorrectAnswerElement = document.querySelector('#show-correct-answer');
		}
		catch (e) {
			console.error(e);
		}
	}

	@HostListener('window:beforeunload')
	async ngOnDestroy() {
		await this.triviaService.triviaDisconnect();
	}

	openModal(title: string, body: string, footerText: string) {
		if (!this.modalService.hasOpenModals()) {
			const modalRef: NgbModalRef = this.modalService.open(PlayerModalComponent);
			modalRef.componentInstance.title = title;
			modalRef.componentInstance.body = body;
			modalRef.componentInstance.footerText = footerText;
		}
	}

	updateGameState(state: IGameState) {
		this.gameState = state;
	}

	newGame() {
		console.log(`Running new game`);
		this.username = this.usernameInputField.value;
		if (!this.username) this.username = `anonymous${Math.floor(Math.random() * 1000)}`

		//? Get the number of players allowed in the lobby
		const numPlayersInput: HTMLInputElement = document.querySelector('#num-players-selector');
		this.numPlayers = parseFloat(numPlayersInput.value);
		if (this.numPlayers > this.maxNumberOfPlayers || this.numPlayers <= this.minimumNumberOfPlayers) this.maxNumberOfPlayers;

		this.triviaService.triviaInitGame(this.username, this.numPlayers).subscribe(data => {
			console.log(data);
			this.playerNumber = data['playerNumber'];
			this.updateGameState(data['state'] as IGameState);
			this.roomName = data['roomName'];
			this.gameStatus = data['gameStatus'];
			this.previousGameStatus = data['gameStatus'] as IGameState;

			this.getTriviaQuestions();
			this.goToLobby()
			this.runTrivia();
		});
	}

	goToLobby() {
		this.initialGameScreen.style.display = 'none';
		this.gameScreen.style.display = 'block';
	}

	goToHomeScreen() {
		this.initialGameScreen.style.display = 'block';
		this.gameScreen.style.display = 'none';
	}

	joinGame() {
		this.username = this.usernameInputField.value;
		const gameCodeInput: HTMLInputElement = document.querySelector('#gameCodeInput');
		this.roomName = gameCodeInput.value;

		this.triviaService.triviaJoinGame(gameCodeInput.value, this.username || `anonymous${Math.floor(Math.random() * 1000)}`).subscribe(data => {
			this.updateGameState(data as IGameState);
			this.categoryName = this.gameState.questions[0].category;
			this.difficulty = this.gameState.questions[0].difficulty;
			this.goToLobby();
			this.runTrivia();
		});
	}

	handleJoinGame() {
		this.triviaService.triviaJoinGameLobbyEvent().subscribe(data => {
			this.updateGameState(data as IGameState);
			this.runTrivia();
		});
	}

	handlePlayerLeaveGame() {
		this.triviaService.triviaLeaveGame().subscribe(data => {
			this.updateGameState(data as IGameState);
			this.runTrivia();
		});
	}

	handleTooManyPlayers() {
		this.triviaService.triviaTooManyPlayers().subscribe(data => {
			const title = "Lobby is Full";
			const body = `
				<p>The lobby you are attempting to join has already reached the maximum amount of players</p>
			`;
			const footerText = "Close";

			this.openModal(title, body, footerText);
		});
	}

	handleUnknownGame() {
		this.triviaService.triviaUnknownGame().subscribe(data => {
			const title = "Unknown Lobby";
			const body = `
				<p>The lobby you are attempting to join was not found</p>
			`;
			const footerText = "Close";

			this.openModal(title, body, footerText);
		});
	}

	handleReadyUpEvent() {
		this.triviaService.triviaReadyUpEventAll().subscribe(data => {
			this.updateGameState(data as IGameState);
			this.runTrivia();
		});
	};

	handleQuestionCountDown() {
		this.triviaService.triviaQuestionCountDown().subscribe(data => {
			this.gameStatus = `inGame`;
			this.secondsRemaining = data['secondsRemaining'];
			this.questionNumber = data['questionNumber']
			this.runTrivia();
		})
	}

	handleScoreUpdate() {
		this.triviaService.triviaGetPostQuestionScore().subscribe(data => {
			this.gameState = data['state'];
		})
	}

	handlePostGame() {
		this.triviaService.triviaGetPostGameEvent().subscribe(data => {
			this.gameStatus = 'postGame';
			this.runTrivia();
		});
	}

	handleButtonReadyClick() {
		//? define answer submit or ready up
		if (this.gameStatus == "preGame") {
			//?replace and update the IsReady variable in socket IO
			//? send ready up event
			this.buttonReadyDisabled = true;
			this.triviaService.triviaReadyUp(this.roomName);
		}
		else if (this.gameStatus == "postGame") {
			//?do nothing for no
			//? this will be rematch
			this.buttonReadyDisabled = true;
		}
		else {
			//? this will be question answer
			this.selectAnswer = this.getRadioChoice();
			if (this.selectAnswer === this.correctAnswer) {
				this.buttonReadyDisabled = true;
				this.triviaService.triviaAnswerQuestion(true, this.roomName).subscribe(data => {
					this.updateGameState(data as IGameState);
				});
			}
			else if (this.selectAnswer !== "") {
				this.buttonReadyDisabled = true;
				this.triviaService.triviaAnswerQuestion(false, this.roomName).subscribe(data => {
					this.updateGameState(data as IGameState);
				});
			}
			else {
				this.triviaService.triviaAnswerQuestion(false, this.roomName).subscribe(data => {
					this.updateGameState(data as IGameState);
				});
			}
			this.buttonReadyDisabled = true;
		}
	}

	getRadioChoice() {
		let choices: any = document.getElementsByName('choice');
		for (var i = 0, length = choices.length; i < length; i++) {
			if (choices[i].checked) {
				//? do whatever you want with the checked radio
				return choices[i].value;
			}
		}
	}

	clearRadioChoice() {
		let choices: any = document.getElementsByName('choice');
		for (var i = 0, length = choices.length; i < length; i++) {
			if (choices[i].checked) {
				//? do whatever you want with the checked radio
				choices[i].checked = false;
			}
		}
	}

	handleRadioChange(event: any) {
		this.selectAnswer = event.target.value;
	}

	getTriviaQuestions() {
		const numQuestionsInputElement: HTMLInputElement = document.querySelector('#num-questions-selector');
		const difficultyInputElement: HTMLInputElement = document.querySelector('#difficulty-selector');
		const categoryInputElement: HTMLInputElement = document.querySelector('#category-selector');
		let url = `${environment.trivia_url}`;

		//? enforce multiple choice
		url += `?type=multiple`;

		//? Number to get
		if (parseFloat(numQuestionsInputElement.value) > this.maxNumberOfQuestions) {
			numQuestionsInputElement.value = this.maxNumberOfQuestions.toString();
		}
		url += `&amount=${numQuestionsInputElement.value}`

		//? difficulty
		this.difficulty = difficultyInputElement.value;
		if (difficultyInputElement.value !== "any") {
			url += `&difficulty=${difficultyInputElement.value}`
		}

		//? See if ACG History is selected
		if (parseFloat(categoryInputElement.value) === -1) {
			const questions: Question[] = ACGHistoryQuestions.slice(0, parseFloat(numQuestionsInputElement.value));
			this.gameState.questions = questions;
			this.categoryName = questions[0].category;
			console.log(`this.gameState.questions.length: ${this.gameState.questions.length}`);
			this.triviaService.triviaSaveQuestions(questions, this.roomName);
			return;
		}
		//? Category
		url += `&category=${categoryInputElement.value}`

		console.log(url);
		this.http.get(url).subscribe(data => {
			let results = data['results'] as Question[];
			if (results.length === 0) {
				this.goToHomeScreen();

				const title = "No Questions Found";
				const body = `
					<p>The category you specified does not have any questions. Please select a different one</p>
				`;
				const footerText = "Close";
				this.openModal(title, body, footerText);
				return;
			}
			this.gameState.questions = results;
			this.categoryName = this.gameState.questions[0].category;
			this.triviaService.triviaSaveQuestions(results, this.roomName);
		})
	}

	getTriviaCategories() {
		const ACGHistoryQuestionsCategory: TriviaCategory = {
			id: -1,
			name: "ACG History"
		}
		this.categories.push(ACGHistoryQuestionsCategory);

		this.http.get(environment.trivia_categories_url).subscribe(data => {
			for (let i = 0; i < data['trivia_categories'].length; i++) {
				let category: TriviaCategory = {
					id: data['trivia_categories'][i].id,
					name: data['trivia_categories'][i].name
				}
				this.categories.push(category);
			}
		})
	}

	removeElementsByClassName(className: string) {
		document.querySelectorAll(`.${className}`)
			.forEach(e => e.remove());
	}

	displayPlayerInfoRow(players: IPlayer[], messageType: string) {
		for (let i = 0; i < players.length; i++) {
			const lobby = document.getElementById('lobby-screen');
			const div = document.createElement('div');
			div.className = "player-info-row";

			let message: string = ""
			switch (messageType) {
				case "pre-game":
					message = `Player ${i + 1}: ${players[i].username} --- ${players[i].ready ? "Ready" : "Not Ready"}`;
					break;
				case "in-game":
					message = `${this.gameState.players[i].username}: ${this.gameState.players[i].score}`;
					break;
				case "post-game":
					message = `${this.gameState.players[i].username}: ${this.gameState.players[i].score}`;
					break;
			}
			const divText: HTMLElement = document.createElement('p');
			divText.innerText = message;
			divText.style.fontSize = "1.2em";
			div.appendChild(divText);
			lobby.appendChild(div);
		}
	}

	//?setup name values
	runTrivia() {
		//? remove old HTML state
		this.removeElementsByClassName('player-info-row');

		//?display variables
		let playerHeader1: string;

		if (this.gameStatus == "preGame") {
			//? main window play screen setup for the pre game
			document.getElementById("gameWindowHeader1").innerHTML = "How To Play";

			document.getElementById("gameWindowExplanation1").innerHTML = "HatchTrivia consists of a number of multiple choice questions. Answer them correctly within the provided time window to earn points. Whoever has the most points at the end of the game wins!";

			//?Div section
			//?Turnon header2
			document.getElementById("intHeader2Div").style.display = "block";
			//?turn off the answer selector
			document.getElementById("intAnswerDiv").style.display = "none";

			//?Button
			this.buttonLabel = "Ready"
			document.getElementById("buttonReady").innerHTML = this.buttonLabel;

			playerHeader1 = "Player List";
			document.getElementById("playerHeader1").innerHTML = playerHeader1;

			this.displayPlayerInfoRow(this.gameState.players, "pre-game")
		}
		else if (this.gameStatus == "postGame") {
			this.showCorrectAnswerElement.innerText = '';
			document.getElementById("timer").innerHTML = "";
			document.getElementById("gameWindowHeader1").innerHTML = "The Winner Is";

			//?loop for user with the highest score
			this.gameWinnerName = this.gameState.players[0].username;
			this.gameWinnerScore = this.gameState.players[0].score;
			let triviaCurrentName: string;
			let triviaCurrentScore: number;
			for (let i = 1; i < this.gameState.players.length; i++) {
				triviaCurrentScore = this.gameState.players[i].score;
				triviaCurrentName = this.gameState.players[i].username;

				if (this.gameWinnerScore < triviaCurrentScore) {
					this.gameWinnerName = triviaCurrentName
					this.gameWinnerScore = triviaCurrentScore
				}
				else if (this.gameWinnerScore === triviaCurrentScore) {
					this.gameWinnerName += " and " + triviaCurrentName
				}
			}
			document.getElementById("gameWindowExplanation1").innerHTML = this.gameWinnerName + " with with a score of " + this.gameWinnerScore;


			//?Div section
			//?Turn off header2
			document.getElementById("intHeader2Div").style.display = "none";
			//?turn off the answer selector
			document.getElementById("intAnswerDiv").style.display = "none";

			//?Button
			this.buttonLabel = "Play Again"
			document.getElementById("buttonReady").innerHTML = this.buttonLabel;

			//?playerHeader1 controls the header for the player side of the game
			playerHeader1 = "Final Score";
			document.getElementById("playerHeader1").innerHTML = playerHeader1;


			this.displayPlayerInfoRow(this.gameState.players, "post-game")
		}
		else {
			let answer1;
			let answer2;
			let answer3;
			let answer4;
			//? if (this.gameStatus !== this.previousGameStatus) {
			if (this.secondsRemaining === 30) {
				this.buttonReadyDisabled = false;
				this.previousGameStatus = this.gameState;

				//?TODO randomize questions
				let questions = [this.gameState.questions[this.questionNumber - 1].correct_answer];
				questions = [...questions, ...this.gameState.questions[this.questionNumber - 1].incorrect_answers];
				const randomIndex = Math.floor(Math.random() * 3);
				if (randomIndex === 3) {
					const tempQuestion = questions[0];
					questions[0] = questions[randomIndex];
					questions[randomIndex] = tempQuestion;
					this.correctAnswer = 'answer4';
					answer1 = this.gameState.questions[this.questionNumber - 1].incorrect_answers[0]; //?Replace answer one from socket (this should be the answer from open triva (Correct answer should be random))
					answer2 = this.gameState.questions[this.questionNumber - 1].incorrect_answers[1]; //?Replace answer two from socket
					answer3 = this.gameState.questions[this.questionNumber - 1].incorrect_answers[2]; //?Replace answer three from socket
					answer4 = this.gameState.questions[this.questionNumber - 1].correct_answer //?Replace answer four from socket
				}
				else if (randomIndex === 2) {
					const tempQuestion = questions[0];
					questions[0] = questions[randomIndex];
					questions[randomIndex] = tempQuestion;
					this.correctAnswer = 'answer3';
					answer1 = this.gameState.questions[this.questionNumber - 1].incorrect_answers[0]; //?Replace answer one from socket (this should be the answer from open triva (Correct answer should be random))
					answer2 = this.gameState.questions[this.questionNumber - 1].incorrect_answers[1]; //?Replace answer two from socket
					answer3 = this.gameState.questions[this.questionNumber - 1].correct_answer
					answer4 = this.gameState.questions[this.questionNumber - 1].incorrect_answers[2]; //?Replace answer three from socket
				}
				else if (randomIndex === 1) {
					const tempQuestion = questions[0];
					questions[0] = questions[randomIndex];
					questions[randomIndex] = tempQuestion;
					this.correctAnswer = 'answer2';
					answer1 = this.gameState.questions[this.questionNumber - 1].incorrect_answers[0]; //?Replace answer one from socket (this should be the answer from open triva (Correct answer should be random))
					answer2 = this.gameState.questions[this.questionNumber - 1].correct_answer
					answer3 = this.gameState.questions[this.questionNumber - 1].incorrect_answers[1]; //?Replace answer two from socket
					answer4 = this.gameState.questions[this.questionNumber - 1].incorrect_answers[2]; //?Replace answer three from socket
				}
				else {
					this.correctAnswer = 'answer1';
					answer1 = this.gameState.questions[this.questionNumber - 1].correct_answer
					answer2 = this.gameState.questions[this.questionNumber - 1].incorrect_answers[0]; //?Replace answer one from socket (this should be the answer from open triva (Correct answer should be random))
					answer3 = this.gameState.questions[this.questionNumber - 1].incorrect_answers[1]; //?Replace answer two from socket
					answer4 = this.gameState.questions[this.questionNumber - 1].incorrect_answers[2]; //?Replace answer three from socket
				}

				document.getElementById("answer1").innerHTML = answer1;
				document.getElementById("answer2").innerHTML = answer2;
				document.getElementById("answer3").innerHTML = answer3;
				document.getElementById("answer4").innerHTML = answer4;
				this.clearRadioChoice();
				this.showCorrectAnswerElement.innerText = '';
			}

			if (this.secondsRemaining === 0) {
				let answer = this.decodeHtmlEntity(this.gameState.questions[this.questionNumber - 1].correct_answer);
				answer = answer.replace(/&quot;/g, '"')
				this.showCorrectAnswerElement.innerText = `The correct answer is: ${answer}`;
			}

			let triviaQuestion: string = this.gameState.questions[this.questionNumber - 1].question;

			//? main window play screen setup for the game
			//?setup question
			document.getElementById("gameWindowHeader1").innerHTML = `Question ${this.questionNumber} of ${this.gameState.questions.length}`;
			document.getElementById("gameWindowExplanation1").innerHTML = triviaQuestion;

			//?Div section
			//?Turnoff header2		
			document.getElementById("intHeader2Div").style.display = "none";
			//?turn on the answer selector
			document.getElementById("intAnswerDiv").style.display = "block";

			//?rename Button
			this.buttonLabel = "Submit Answer"
			document.getElementById("buttonReady").innerHTML = this.buttonLabel;

			//?Timer function
			document.getElementById("timer").innerHTML = `Time left to answer a question: ${this.secondsRemaining <= 0 ? 0 : this.secondsRemaining}`;
			//?Timer function End

			//?playerHeader1 controls the header for the player side of the game
			playerHeader1 = "Current Score...";
			document.getElementById("playerHeader1").innerHTML = playerHeader1;

			this.displayPlayerInfoRow(this.gameState.players, "in-game")
		}
	}

	generateRandomUsername() {
		this.usernameInputField.value = UsernameGenerator.generateRandomUsername();
	}

	decodeHtmlEntity(str: string): string {
		return str.replace(/&#(\d+);/g, function (match, dec) {
			return String.fromCharCode(dec);
		});
	};
}
