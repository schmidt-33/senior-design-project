import { Injectable } from '@angular/core';
import { WebsocketService } from 'src/app/shared/services/websocket/websocket.service';

@Injectable({
	providedIn: 'root'
})
export class ApplestoapplesService {
	static ApplestoapplesService: any;

constructor(
		private websocketService: WebsocketService
	) { }


    applestoapplesInitGame(username: string) {
		console.log(`Called applestoapplesInitGame`);
		this.websocketService.emitWebsocketEvent(`applestoapples-init-game`, { username });
		return this.websocketService.observeWebsocketEvent(`applestoapples-init-game`);
	}
	applestoapplesJoinGame(roomCode: string, username: string) {
		this.websocketService.emitWebsocketEvent(`applestoapples-join-game`, { roomCode, username });
		return this.websocketService.observeWebsocketEvent(`applestoapples-join-game`);
	}

	applestoapplesJoinGameLobbyEvent() {
		return this.websocketService.observeWebsocketEvent(`applestoapples-join-game-all`);
	}

	// too many players in lobby
	applestoapplesTooManyPlayers() {
		return this.websocketService.observeWebsocketEvent(`applestoapples-too-many-players`);
	}

	// unknown game code
	applestoapplesUnknownGame() {
		return this.websocketService.observeWebsocketEvent(`applestoapples-unknown-game`);
	}

	applestoapplesReadyUp(roomName: string) {
		this.websocketService.emitWebsocketEvent(`applestoapples-ready-up`, { roomName });
	}
	applestoapplesPlayerCardSend(card:string, roomName:string, playerNumber: number){
		this.websocketService.emitWebsocketEvent(`applestoapples-psend-card`, { card, roomName, playerNumber });
	}
	
	applestoapplesReadyUpEventAll() {
		return this.websocketService.observeWebsocketEvent(`applestoapples-ready-up-all`);
	}
	
	applestoapplesChangetoPlayScreen() {
		return this.websocketService.observeWebsocketEvent('change-screen');
	}
	applestoapplesStartCards()
	{
		return this.websocketService.observeWebsocketEvent('start-cards-players');


	}
	applestoapplesStartGreenCard()
	{
		return this.websocketService.observeWebsocketEvent('start-greencard-players');


	}
	applestoapplesCardtobeJudged()
	{
		return this.websocketService.observeWebsocketEvent('card-to-be-judged');


	}
	applestoapplesJudgeStatus()
	{
		return this.websocketService.observeWebsocketEvent('applestoapples-judge');


	}
	applestoapplesAllowjudging()
	{
		return this.websocketService.observeWebsocketEvent('applestoapples-judging');


	}
	applestoapplesScore(roomName:string,playerNumber:number)
	{
		this.websocketService.emitWebsocketEvent(`applestoapples-score`, {  roomName, playerNumber });

	}
	applestoapplesDrawCard()
	{
		return this.websocketService.observeWebsocketEvent('applestoapples-drawcard');

	
	}
	applestoapplesclearInplay()
	{
		return this.websocketService.observeWebsocketEvent('applestoapples-clear-inplay');

	
	}
	applestoapplesWinNotify()
	{
		return this.websocketService.observeWebsocketEvent('applestoapples-win');


	}
}