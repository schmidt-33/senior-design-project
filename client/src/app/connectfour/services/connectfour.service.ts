import { Injectable } from '@angular/core';
import { WebsocketService } from 'src/app/shared/services/websocket/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectfourService {

  constructor(private websocketService: WebsocketService) { }


  connectfourNewGame() {
		this.websocketService.emitWebsocketEvent('connectfour-new-game', {});
		return this.websocketService.observeWebsocketEvent('connectfour-new-game');
	}

	connectfourJoinGame(gameCode: string) {
		this.websocketService.emitWebsocketEvent('connectfour-join-game', { gameCode });
		return this.websocketService.observeWebsocketEvent('connectfour-join-game');
	}

	connectfourInit() {
		return this.websocketService.observeWebsocketEvent('connectfour-init');
	}

	connectfourGamestate() {
		return this.websocketService.observeWebsocketEvent('connectfour-game-state');
	}
	
	
	connectfourTurnSE(roomName:string, column:number, playerNumber:number){
		this.websocketService.emitWebsocketEvent('connectfour-turnse',{roomName,column,playerNumber});

	}
	connectfourTurnRE(){
		return this.websocketService.observeWebsocketEvent('connectfour-peice-data');
	
	}
	

	connectfourGameOver() {
		return this.websocketService.observeWebsocketEvent('connectfour-game-over');
	}

	connectfourGameCode() {
		return this.websocketService.observeWebsocketEvent('connectfour-game-code');
	}

	connectfourUnknownGame() {
		return this.websocketService.observeWebsocketEvent('connectfour-unknown-game');
	}

	connectfourTooManyPlayers() {
		return this.websocketService.observeWebsocketEvent('connectfour-too-many-players');
	}

	connectfourOnlineCount() {
		return this.websocketService.observeWebsocketEvent('connectfour-online-count');
	}

	connectfourRematchCount() {
		return this.websocketService.observeWebsocketEvent('connectfour-rematch-count');
	}

	connectfourSendRematchEvent(gameCode: string) {
		this.websocketService.emitWebsocketEvent('connectfour-rematch', { gameCode });
	}


}
