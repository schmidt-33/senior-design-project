import { Injectable } from '@angular/core';
import { WebsocketService } from 'src/app/shared/services/websocket/websocket.service';

@Injectable({
	providedIn: 'root'
})
export class CheckersService {

	constructor(
		private websocketService: WebsocketService
	) { }

	checkersNewGame() {
		this.websocketService.emitWebsocketEvent('checkers-new-game', {});
		return this.websocketService.observeWebsocketEvent('checkers-new-game');
	}

	checkersJoinGame(gameCode: string) {
		this.websocketService.emitWebsocketEvent('checkers-join-game', { gameCode });
		return this.websocketService.observeWebsocketEvent('checkers-join-game');
	}

	checkersInit() {
		return this.websocketService.observeWebsocketEvent('checkers-init');
	}

	checkersGamestate() {
		return this.websocketService.observeWebsocketEvent('checkers-game-state');
	}
	checkersTurnSE(player: number, roomName: string){
		this.websocketService.emitWebsocketEvent('checkers-turnse',{player,roomName});

	}
	checkersTurnRE(){
	return this.websocketService.observeWebsocketEvent('checkers-turnre');

	}
	checkersPieceMove(selpRow:number ,selpColumn:number,toRow:number,toColumn:number,roomName:string,playerNum:number){
		this.websocketService.emitWebsocketEvent('checkers-piece-move',{selpRow,selpColumn,toRow,toColumn,roomName,playerNum});

	}

	checkersPieceMoveUpdate(){
		return this.websocketService.observeWebsocketEvent('piece-move-update');
	}
	checkersRemovePiece(removedPieceRow:number,removedPieceColumn:number,roomName:string, playerNum:number){
		this.websocketService.emitWebsocketEvent('checkers-remove-piece',{removedPieceRow,removedPieceColumn,roomName,playerNum});

	}
	checkersRemovePieceUpdate(){
		return this.websocketService.observeWebsocketEvent('piece-remove-update');



	}
	checkersWinMessage(roomName:string,playerNum:number){
		this.websocketService.emitWebsocketEvent('checkers-win-message',{roomName,playerNum});

	}
	checkersWinMessageUpdate(){
		return this.websocketService.observeWebsocketEvent('checkers-winmessage');


	}
	checkersBoardMove(board: string[][], roomName: string) {
		this.websocketService.emitWebsocketEvent('checkers-board-move', { board, roomName }); 
	}

	checkersGameOver() {
		return this.websocketService.observeWebsocketEvent('checkers-game-over');
	}

	checkersGameCode() {
		return this.websocketService.observeWebsocketEvent('checkers-game-code');
	}

	checkersUnknownGame() {
		return this.websocketService.observeWebsocketEvent('checkers-unknown-game');
	}

	checkersTooManyPlayers() {
		return this.websocketService.observeWebsocketEvent('checkers-too-many-players');
	}

	checkersOnlineCount() {
		return this.websocketService.observeWebsocketEvent('checkers-online-count');
	}

	checkersRematchCount() {
		return this.websocketService.observeWebsocketEvent('checkers-rematch-count');
	}

	checkersSendRematchEvent(gameCode: string) {
		this.websocketService.emitWebsocketEvent('checkers-rematch', { gameCode });
	}

	keyDownEvent(keyCode: any) {
		this.websocketService.emitWebsocketEvent('checkers-key-down', { keyCode })
	}
}