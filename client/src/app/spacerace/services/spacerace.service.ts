import { Injectable } from '@angular/core';
import { WebsocketService } from 'src/app/shared/services/websocket/websocket.service';

@Injectable({
	providedIn: 'root'
})
export class SpaceraceService {

	constructor(
		private websocketService: WebsocketService
	) {}

	spaceraceNewGame() {
		this.websocketService.emitWebsocketEvent('spacerace-new-game', {});
		return this.websocketService.observeWebsocketEvent('spacerace-new-game');
	}

	spaceraceJoinGame(gameCode: string) {
		this.websocketService.emitWebsocketEvent('spacerace-join-game', {gameCode});
		return this.websocketService.observeWebsocketEvent('spacerace-join-game');
	}

	spaceraceInit() {
		return this.websocketService.observeWebsocketEvent('spacerace-init');
	}

	spaceraceGamestate() {
		return this.websocketService.observeWebsocketEvent('spacerace-game-state');
	}

	spaceraceEmitNewWave() {
		return this.websocketService.observeWebsocketEvent('spacerace-new-wave');
	}
	
	keyDownEvent(keyCode: any) {
		this.websocketService.emitWebsocketEvent('spacerace-key-down', { keyCode });
	}

	spaceraceGameOver() {
		return this.websocketService.observeWebsocketEvent('spacerace-game-over');
	}

	spaceraceGameCode() {
		return this.websocketService.observeWebsocketEvent('spacerace-game-code');
	}

	spaceraceUnknownGame() {
		return this.websocketService.observeWebsocketEvent('spacerace-unknown-game');
	}

	spaceraceTooManyPlayers() {
		return this.websocketService.observeWebsocketEvent('spacerace-too-many-players');
	}

	spaceraceOnlineCount() {
		return this.websocketService.observeWebsocketEvent('spacerace-online-count');
	}

	spaceraceRematchCount() {
		return this.websocketService.observeWebsocketEvent('spacerace-rematch-count');
	}

	spaceraceSendRematchEvent(gameCode: string) {
		this.websocketService.emitWebsocketEvent('spacerace-rematch', { gameCode });
	}
}