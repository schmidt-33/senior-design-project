import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebsocketService } from 'src/app/shared/services/websocket/websocket.service';

@Injectable({
	providedIn: 'root'
})
export class TriviaService {

	constructor(
		private websocketService: WebsocketService
	) { }

	// init game
	triviaInitGame(username: string, numPlayers: number) {
		console.log(`Called triviaInitGame`);
		this.websocketService.emitWebsocketEvent(`trivia-init-game`, { username, numPlayers });
		return this.websocketService.observeWebsocketEvent(`trivia-init-game`);
	}

	// join game
	triviaJoinGame(roomCode: string, username: string) {
		this.websocketService.emitWebsocketEvent(`trivia-join-game`, { roomCode, username });
		return this.websocketService.observeWebsocketEvent(`trivia-join-game`);
	}

	triviaLeaveGame() {
		return this.websocketService.observeWebsocketEvent(`trivia-leave-game`);
	}

	triviaJoinGameLobbyEvent() {
		return this.websocketService.observeWebsocketEvent(`trivia-join-game-all`);
	}

	// too many players in lobby
	triviaTooManyPlayers() {
		return this.websocketService.observeWebsocketEvent(`trivia-too-many-players`);
	}

	// unknown game code
	triviaUnknownGame() {
		return this.websocketService.observeWebsocketEvent(`trivia-unknown-game`);
	}

	triviaReadyUp(roomName: string) {
		this.websocketService.emitWebsocketEvent(`trivia-ready-up`, { roomName });
	}

	triviaReadyUpEventAll() {
		return this.websocketService.observeWebsocketEvent(`trivia-ready-up-all`);
	}

	// send questions to server 
	triviaSaveQuestions(questions: Object, roomName: string) {
		this.websocketService.emitWebsocketEvent(`trivia-questions`, { questions, roomName });
	}

	triviaQuestionCountDown() {
		return this.websocketService.observeWebsocketEvent(`trivia-seconds-remaining`);
	}

	triviaAnswerQuestion(isCorrect: boolean, roomName: string) {
		this.websocketService.emitWebsocketEvent(`trivia-answer-question`, { isCorrect, roomName });
		return this.websocketService.observeWebsocketEvent(`trivia-answer-question`);
	}

	triviaGetPostQuestionScore() {
		return this.websocketService.observeWebsocketEvent(`trivia-post-question-score`);
	}

	triviaGetPostGameEvent() {
		return this.websocketService.observeWebsocketEvent(`trivia-post-game`);
	}

	async triviaDisconnect() {
		return new Promise((resolve, reject) => {
			const status = this.websocketService.disconnectWebsocketEvent();
			console.log(`disconnect status: ${status}`);
			return resolve(status);
		});
	}

	reconnectTriviaWebsocket(): boolean {
		return this.websocketService.reconnectSocket();
	}

	triviaLeaveGameEvent(): Observable<object> {
		return this.websocketService.observeWebsocketEvent('trivia-join-game-all');
	}
}
