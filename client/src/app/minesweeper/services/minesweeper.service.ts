import { Injectable } from '@angular/core';
import { WebsocketService } from 'src/app/shared/services/websocket/websocket.service';

@Injectable({
	providedIn: 'root'
})
export class MinesweeperService {

	constructor(
		private websocketService: WebsocketService
	) {}

	minesweeperNewGame() {
		this.websocketService.emitWebsocketEvent('minesweeper-new-game', {});
		return this.websocketService.observeWebsocketEvent('minesweeper-new-game');
	}

	minesweeperJoinGame(gameCode: string) {
		this.websocketService.emitWebsocketEvent('minesweeper-join-game', {gameCode});
		return this.websocketService.observeWebsocketEvent('minesweeper-join-game');
	}

	minesweeperInit() {
		return this.websocketService.observeWebsocketEvent('minesweeper-init');
	}

	minesweeperGamestate() {
		return this.websocketService.observeWebsocketEvent('minesweeper-game-state');
	}
	
	keyDownEvent(keyCode: any) {
		this.websocketService.emitWebsocketEvent('minesweeper-key-down', { keyCode });
	}

	minesweeperChooseSquare(id: number, turn: boolean) {
        this.websocketService.emitWebsocketEvent('minesweeper-choose-square', {id, turn});
        return this.websocketService.observeWebsocketEvent('minesweeper-choose-square');
    }

	minesweeperGameOver() {
		return this.websocketService.observeWebsocketEvent('minesweeper-game-over');
	}

	minesweeperGameCode() {
		return this.websocketService.observeWebsocketEvent('minesweeper-game-code');
	}

	minesweeperUnknownGame() {
		return this.websocketService.observeWebsocketEvent('minesweeper-unknown-game');
	}

	minesweeperTooManyPlayers() {
		return this.websocketService.observeWebsocketEvent('minesweeper-too-many-players');
	}

	minesweeperOnlineCount() {
		return this.websocketService.observeWebsocketEvent('minesweeper-online-count');
	}

	minesweeperRematchCount() {
		return this.websocketService.observeWebsocketEvent('minesweeper-rematch-count');
	}

	minesweeperSendRematchEvent(gameCode: string) {
		this.websocketService.emitWebsocketEvent('minesweeper-rematch', { gameCode });
	}
}