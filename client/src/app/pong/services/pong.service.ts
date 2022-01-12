import { Injectable } from '@angular/core';
import { WebsocketService } from 'src/app/shared/services/websocket/websocket.service';

@Injectable({
	providedIn: 'root'
})
export class PongService {

	constructor(
		private websocketService: WebsocketService
	) {}

	pongNewGame() {
		this.websocketService.emitWebsocketEvent('pong-new-game', {});
		return this.websocketService.observeWebsocketEvent('pong-new-game');
	}

	pongJoinGame(gameCode: string) {
		this.websocketService.emitWebsocketEvent('pong-join-game', {gameCode});
		return this.websocketService.observeWebsocketEvent('pong-join-game');
	}

	pongInit() {
		return this.websocketService.observeWebsocketEvent('pong-init');
	}

	pongGamestate() {
		return this.websocketService.observeWebsocketEvent('pong-game-state');
	}
	
	keyDownEvent(keyCode: any) {
		this.websocketService.emitWebsocketEvent('pong-key-down', { keyCode });
	}

	pongGameOver() {
		return this.websocketService.observeWebsocketEvent('pong-game-over');
	}

	pongGameCode() {
		return this.websocketService.observeWebsocketEvent('pong-game-code');
	}

	pongUnknownGame() {
		return this.websocketService.observeWebsocketEvent('pong-unknown-game');
	}

	pongTooManyPlayers() {
		return this.websocketService.observeWebsocketEvent('pong-too-many-players');
	}

	pongOnlineCount() {
		return this.websocketService.observeWebsocketEvent('pong-online-count');
	}

	pongRematchCount() {
		return this.websocketService.observeWebsocketEvent('pong-rematch-count');
	}

	pongSendRematchEvent(gameCode: string) {
		this.websocketService.emitWebsocketEvent('pong-rematch', { gameCode });
	}
}