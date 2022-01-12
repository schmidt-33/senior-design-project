import { Injectable } from '@angular/core';
import { WebsocketService } from 'src/app/shared/services/websocket/websocket.service';

@Injectable({
	providedIn: 'root'
})
export class AsteroidsService {

	constructor(
		private websocketService: WebsocketService
	) { }

	newGame() {
		this.websocketService.emitWebsocketEvent('asteroids-new-game', {});
		return this.websocketService.observeWebsocketEvent('asteroids-new-game');
	}

	joinGame(gameCode: string) {
		this.websocketService.emitWebsocketEvent('asteroids-join-game', { gameCode });
		this.websocketService.observeWebsocketEvent('asteroids-join-game');
	}

	gameState() {
		return this.websocketService.observeWebsocketEvent(`asteroids-game-state`);
	}

	keyPressEvent(keyCode: number) {
		this.websocketService.emitWebsocketEvent('asteroids-key-press', { keyCode });
	}

	roomCode() {
		return this.websocketService.observeWebsocketEvent('asteroids-room-code');
	}
}
