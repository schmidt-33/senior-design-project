import { Injectable } from '@angular/core';
import { WebsocketService } from 'src/app/shared/services/websocket/websocket.service';

@Injectable({
	providedIn: 'root'
})
export class SnakeService {

	constructor(
		private websocketService: WebsocketService
	) {}

	snakeNewGame(color: string) {
		this.websocketService.emitWebsocketEvent('snake-new-game', { color });
		return this.websocketService.observeWebsocketEvent('snake-new-game');
	}

	snakeJoinGame(gameCode: string, color: string) {
		this.websocketService.emitWebsocketEvent('snake-join-game', { gameCode, color });
		return this.websocketService.observeWebsocketEvent('snake-join-game');
	}

	snakeInit() {
		return this.websocketService.observeWebsocketEvent('snake-init');
	}

	snakeGamestate() {
		
		return this.websocketService.observeWebsocketEvent('snake-game-state');
	}

	snakeGameOver() {
		
		return this.websocketService.observeWebsocketEvent('snake-game-over');
	}

	snakeGameCode() {
		return this.websocketService.observeWebsocketEvent('snake-game-code');
	}

	snakeUnknownGame() {
		return this.websocketService.observeWebsocketEvent('snake-unknown-game');
	}

	snakeTooManyPlayers() {
		return this.websocketService.observeWebsocketEvent('snake-too-many-players');
	}

	snakeOnlineCount() {
		return this.websocketService.observeWebsocketEvent('snake-online-count');
	}

	snakeRematchCount() {
		return this.websocketService.observeWebsocketEvent('snake-rematch-count');
	}

	snakeSendRematchEvent(gameCode: string, color: string) {
		this.websocketService.emitWebsocketEvent('snake-rematch', { gameCode, color });
	}

	keyDownEvent(keyCode: any) {
		this.websocketService.emitWebsocketEvent('snake-key-down', { keyCode })
	}
}
