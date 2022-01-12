import { Injectable, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/shared/services/websocket/websocket.service';

@Injectable({
	providedIn: 'root'
})
export class HomeService {

	constructor(
		private websocketService: WebsocketService
	) {
		console.log(`Home Websocket Service Connected`);
	 }

	requestOnlineCount() {
		return this.websocketService.emitWebsocketEvent('online-count', {});
	}

	listenForOnlineCount() {
		return this.websocketService.observeWebsocketEvent('online-count');
	}

	listenForInGameCount() {
		return this.websocketService.observeWebsocketEvent('in-game-count');
	}

	requestForInGameCount() {
		return this.websocketService.emitWebsocketEvent('in-game-count', {});
	}

	disconnectHomeWebsocket(): boolean {
		return this.websocketService.disconnectWebsocketEvent();
	}

	reconnectHomeWebsocket(): boolean {
		return this.websocketService.reconnectSocket();
	}
}
