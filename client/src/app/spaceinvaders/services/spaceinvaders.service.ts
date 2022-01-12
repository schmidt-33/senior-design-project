import { Injectable } from '@angular/core';
import { WebsocketService } from 'src/app/shared/services/websocket/websocket.service';

@Injectable({
	providedIn: 'root'
})
export class SpaceinvadersService {

	constructor(
		private websocketService: WebsocketService
	) {}

	spaceinvadersNewGame() {
		this.websocketService.emitWebsocketEvent('spaceinvaders-new-game', {});
		return this.websocketService.observeWebsocketEvent('spaceinvaders-new-game');
	}

	spaceinvadersJoinGame(gameCode: string) {
		this.websocketService.emitWebsocketEvent('spaceinvaders-join-game', {gameCode});
		return this.websocketService.observeWebsocketEvent('spaceinvaders-join-game');
	}

	spaceinvadersInit() {
		return this.websocketService.observeWebsocketEvent('spaceinvaders-init');
	}

	spaceinvadersGamestate() {
		return this.websocketService.observeWebsocketEvent('spaceinvaders-game-state');
	}

	spaceinvadersEmitNewWave() {
		return this.websocketService.observeWebsocketEvent('spaceinvaders-new-wave');
	}

	spaceinvadersEliminateAlien(row: number, col: number, pNum: number, gamecode: string) {
		this.websocketService.emitWebsocketEvent('spaceinvaders-eliminate-alien', {row, col, pNum, gamecode});
	}

	spaceinvadersFireAlienMissile(missileX: number, missileY: number, gamecode: string) {
		this.websocketService.emitWebsocketEvent('spaceinvaders-fire-alien-missile', {missileX, missileY, gamecode});
	}

	spaceinvadersAliensWin(gameCode: string) {
		this.websocketService.emitWebsocketEvent('spaceinvaders-aliens-win', {gameCode});
	}
	
	keyDownEvent(keyCode: any) {
		this.websocketService.emitWebsocketEvent('spaceinvaders-key-down', { keyCode });
	}

	spaceinvadersGameOver() {
		return this.websocketService.observeWebsocketEvent('spaceinvaders-game-over');
	}

	spaceinvadersGameCode() {
		return this.websocketService.observeWebsocketEvent('spaceinvaders-game-code');
	}

	spaceinvadersUnknownGame() {
		return this.websocketService.observeWebsocketEvent('spaceinvaders-unknown-game');
	}

	spaceinvadersTooManyPlayers() {
		return this.websocketService.observeWebsocketEvent('spaceinvaders-too-many-players');
	}

	spaceinvadersOnlineCount() {
		return this.websocketService.observeWebsocketEvent('spaceinvaders-online-count');
	}

	spaceinvadersRematchCount() {
		return this.websocketService.observeWebsocketEvent('spaceinvaders-rematch-count');
	}

	spaceinvadersSendRematchEvent(gameCode: string) {
		this.websocketService.emitWebsocketEvent('spaceinvaders-rematch', { gameCode });
	}
}