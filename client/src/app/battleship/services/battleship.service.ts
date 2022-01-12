import { Injectable } from '@angular/core';
import { WebsocketService } from 'src/app/shared/services/websocket/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class BattleshipService {

  constructor(private websocketService: WebsocketService) { }


  battleshipNewGame() {
		this.websocketService.emitWebsocketEvent('battleship-new-game', {});
		return this.websocketService.observeWebsocketEvent('battleship-new-game');
	}

	battleshipJoinGame(gameCode: string) {
		this.websocketService.emitWebsocketEvent('battleship-join-game', { gameCode });
		return this.websocketService.observeWebsocketEvent('battleship-join-game');
	}

	battleshipInit() {
		return this.websocketService.observeWebsocketEvent('battleship-init');
	}

	/////////
	battleshipGamestate() {
		return this.websocketService.observeWebsocketEvent('battleship-game-state');
	}
	
	battleshipTurnSE(player: number, roomName: string){
		this.websocketService.emitWebsocketEvent('battleship-turns',{player,roomName});

	}
	battleshipTurnRE(){
		return this.websocketService.observeWebsocketEvent('battleship-turnre')
	}

	battleshipBoardMove(board: string[][], roomName: string) {
		this.websocketService.emitWebsocketEvent('battleship-board-move', { board, roomName }); 
	}////////

	battleshipGameOver() {
		return this.websocketService.observeWebsocketEvent('battleship-game-over');
	}

	battleshipGameCode() {
		return this.websocketService.observeWebsocketEvent('battleship-game-code');
	}

	battleshipUnknownGame() {
		return this.websocketService.observeWebsocketEvent('battleship-unknown-game');
	}

	battleshipTooManyPlayers() {
		return this.websocketService.observeWebsocketEvent('battleship-too-many-players');
	}

	battleshipOnlineCount() {
		return this.websocketService.observeWebsocketEvent('battleship-online-count');
	}

	battleshipRematchCount() {
		return this.websocketService.observeWebsocketEvent('battleship-rematch-count');
	}

	battleshipSendRematchEvent(gameCode: string) {
		this.websocketService.emitWebsocketEvent('battleship-rematch', { gameCode });
	}
	battleshipReadyUp(roomName:string,playerNumber:number){
	this.websocketService.emitWebsocketEvent('battleship-readyup', { roomName ,playerNumber});
	}
	battleshipReadyUpEventAll() {
		return this.websocketService.observeWebsocketEvent(`battleship-ready-up-all`);
	}
	battleshipShoot(roomName:string ,shotFired: number,playerNumber: number)
	{
		this.websocketService.emitWebsocketEvent('battleship-shoot', { roomName ,shotFired, playerNumber});


	}
	battleshipShootReceive()
	{
		return this.websocketService.observeWebsocketEvent('battleship-shoot-enemy-receive');


	}
	battleshipSendShotResult(roomName:string ,shotFired: number,shipName:string,hit:boolean,playerNumber: number)
	{
		this.websocketService.emitWebsocketEvent('battleship-shoot-result', { roomName ,shotFired,shipName,hit, playerNumber});


	}
	battleshipShotResultReceive()
	{
		return this.websocketService.observeWebsocketEvent('battleship-shoot-result-receive');


	}
}
