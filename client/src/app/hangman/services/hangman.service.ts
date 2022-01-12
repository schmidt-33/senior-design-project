import { Injectable } from '@angular/core';
import { WebsocketService } from 'src/app/shared/services/websocket/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class HangmanService {

  constructor(
    private websocketService: WebsocketService
  ) { }

  hangmanNewGame(wordListName: string) {
    this.websocketService.emitWebsocketEvent('hangman-new-game', { wordListName });
    return this.websocketService.observeWebsocketEvent('hangman-new-game');
  }

  hangmanJoinGame(gameCode: string) {
    console.log(gameCode);
    this.websocketService.emitWebsocketEvent('hangman-join-game', { gameCode });
    return this.websocketService.observeWebsocketEvent('hangman-join-game');
  }

  hangmanInit() {
    return this.websocketService.observeWebsocketEvent('hangman-init');
  }

  hangmanGameCode() {
    return this.websocketService.observeWebsocketEvent('hangman-game-code');
  }

  hangmanUnknownGame() {
    return this.websocketService.observeWebsocketEvent('hangman-unknown-game');
  }

  hangmanTooManyPlayers() {
    return this.websocketService.observeWebsocketEvent('hangman-too-many-players');
  }

  hangmanOnlineCount() {
    return this.websocketService.observeWebsocketEvent('hangman-online-count');
  }

  hangmanRematchCount() {
    return this.websocketService.observeWebsocketEvent('hangman-rematch-count');
  }

  hangmanSetWord(secretWord: string) {
    this.websocketService.emitWebsocketEvent('hangman-set-word', { secretWord })
  }

  hangmanTryGuess(letter: string) {
    this.websocketService.emitWebsocketEvent('hangman-try-guess', { letter })
  }

  hangmanGameState() {
    return this.websocketService.observeWebsocketEvent('hangman-game-state');
  }

  hangmanGameOver() {
    return this.websocketService.observeWebsocketEvent('hangman-game-over');
  }

  hangmanSendRematchEvent(gameCode: string) {
    this.websocketService.emitWebsocketEvent('hangman-rematch', { gameCode });
  }
}
