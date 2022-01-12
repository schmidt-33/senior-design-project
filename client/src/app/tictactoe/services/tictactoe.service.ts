import { Injectable } from '@angular/core';
import { WebsocketService } from 'src/app/shared/services/websocket/websocket.service';

@Injectable({
	providedIn: 'root'
})
export class TictactoeService {

	constructor(
		private websocketService: WebsocketService
	) {}

	tictactoeNewGame() {
		this.websocketService.emitWebsocketEvent('tictactoe-new-game', {});
		return this.websocketService.observeWebsocketEvent('tictactoe-new-game');
	}

	tictactoeJoinGame(gameCode: string) {
		this.websocketService.emitWebsocketEvent('tictactoe-join-game', {gameCode});
		return this.websocketService.observeWebsocketEvent('tictactoe-join-game');
	}

	tictactoeInit() {
		return this.websocketService.observeWebsocketEvent('tictactoe-init');
	}

	tictactoeGamestate() {
		return this.websocketService.observeWebsocketEvent('tictactoe-game-state');
    }
    
    tictactoeChooseSquare(id: number, turn: boolean) {
        this.websocketService.emitWebsocketEvent('tictactoe-choose-square', {id, turn});
        return this.websocketService.observeWebsocketEvent('tictactoe-choose-square');
    }

	tictactoeGameOver() {
		return this.websocketService.observeWebsocketEvent('tictactoe-game-over');
	}

	tictactoeGameCode() {
		return this.websocketService.observeWebsocketEvent('tictactoe-game-code');
	}

	tictactoeUnknownGame() {
		return this.websocketService.observeWebsocketEvent('tictactoe-unknown-game');
	}

	tictactoeTooManyPlayers() {
		return this.websocketService.observeWebsocketEvent('tictactoe-too-many-players');
	}

	tictactoeOnlineCount() {
		return this.websocketService.observeWebsocketEvent('tictactoe-online-count');
	}

	tictactoeRematchCount() {
		return this.websocketService.observeWebsocketEvent('tictactoe-rematch-count');
	}

	tictactoeSendRematchEvent(gameCode: string, playerTurn: boolean) {
		this.websocketService.emitWebsocketEvent('tictactoe-rematch', { gameCode, playerTurn });
	}
}