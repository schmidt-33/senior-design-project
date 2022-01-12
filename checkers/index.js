/**
 * Author: Alec Schmidt
 * Date: July.6.2021
 * File: index.js
 * Description: This file handles all socket and game state events for the checkers game
 */
'use strict';
module.exports = {
	checkersSocketEventHandler
};

const { construct } = require('core-js/fn/reflect');
//? Global utilities
const { makeId } = require('../utils');

//? Game constants
const {

} = require('./constants');

//? Game utils
const {
	initCheckers,

} = require('./util');

//? State Mechanisms
let checkersState = {};
let checkersClientRooms = {};


/** 
 * This function listens to and handles all socket events for the game snake
 * @param socket A Socket.IO socket object 
 * @param io A Socket.IO instance 
 */

function checkersSocketEventHandler(socket, io){
	//?=== Socket Listeners ===//
	socket.on('checkers-new-game', handleNewGameCheckers);
	socket.on('checkers-join-game', handleJoinGameCheckers);
	socket.on('checkers-rematch', handleRematchCheckers);
	//socket.on('checkers-board-move', handleBoardMove);
	socket.on('checkers-turnse',handleturn);
	socket.on('checkers-piece-move',handlePieceMove);
	socket.on('checkers-remove-piece',handleRemovePiece);
	socket.on('checkers-win-message',handleWinMessage);

	//?=== Socket Handlers ===//
	function handleNewGameCheckers() {
		//? create a new room ID
		const roomName = makeId(5);
		//? Track what room the user is in
		checkersClientRooms[socket.id] = roomName;
		//? Send room code to the user
		socket.emit('checkers-game-code', { gameCode: roomName });

		//? Initialize game state
		checkersState[roomName] = initCheckers;

		//? Add socket to the room
		socket.join(roomName);
		//? Assign them a player number
		socket.number = 1;
		//? Send the player their number
		socket.emit('checkers-init', { playerNumber: 1 });
	}

	function handleJoinGameCheckers(userData) {
		//? If there is no game code or game code present, send unknown code request
		if (!userData || !userData.gameCode) {
			socket.emit('checkers-unknown-game', 'Unknown Game');
		}

		//? Look for the room the user is requesting
		const room = io.sockets.adapter.rooms.get(userData.gameCode);

		//? If ther is no room or the room is empty, send unknown code response
		if(!room || room.size == 0 || !checkersState[userData.gameCode]) {
			socket.emit('checkers-unknown-game', 'Unknown Game');
			return;
		}
		else if(room.size > 1) {
			//? Room is already full
			socket.emit('checkers-too-many-palyers', 'Too many players');
			return;
		}

		//? Track which room the user is joining
		checkersClientRooms[socket.id] = userData.gameCode;
		//? joing room
		socket.join(userData.gameCode);
		//? Assign them player 2
		socket.number = 2;
		//? Emit the initialization of a new player
		socket.emit('checkers-init', { playerNumber: 2 });
			
		// startGameInterval(userData.gameCode, io);
	}

	function handleRematchCheckers(userData) {
		//? Ensure user data was passed
		if (!userData || !userData.gameCode) return;

		const { gameCode } = userData;
		console.log('gamecode');
		console.log(gameCode);
		console.log('this is the socket id');
		console.log(socket.id);
		//? Determine if a new game stat has been created for a rematch
		if (checkersState[gameCode] && checkersState[gameCode].rematchVotes) {
			//? If one player has already voted for a rematch
			if (!checkersState[gameCode].rematchVotes.includes(socket.id)) {
				console.log('we are here inside of first if');
				io.in(gameCode).emit(`checkers-rematch-count`, { rematchCount: checkersState[gameCode].rematchVotes.length });
				checkersState[gameCode].rematchVotes.push(socket.id);
				console.log(checkersState[gameCode].rematchVotes);

				console.log(checkersState[gameCode].rematchVotes.length);
			}

			//? If the second user has accepted, begin the game
			if (checkersState[gameCode].rematchVotes.length === 2) {
				console.log('secondif');
				console.log(checkersState[gameCode].rematchVotes.length)
				io.in(gameCode).emit(`checkers-rematch-count`, { rematchCount: checkersState[gameCode].rematchVotes.length });
				checkersState[gameCode].rematchVotes.pop();
				checkersState[gameCode].rematchVotes.pop();
			}
		}
		else {
			//? Initialize a new state
			console.log('else');
			checkersState[gameCode] = initCheckers();
			checkersState[gameCode].rematchVotes = [socket.id];
			io.in(gameCode).emit('checkers-rematch-count', { rematchCount: checkersState[gameCode].rematchVotes.length });
		console.log(checkersState[gameCode].rematchVotes.length);
		}
	}
	
	function handlePieceMove(pieceData)
	{
		const fromRow	=	pieceData.selpRow;
		const fromCol =	pieceData.selpColumn;
	
		
		
		const toRow =	pieceData.toRow;
		const toCol =	pieceData.toColumn;
		
			const roomName = pieceData.roomName;
			const playerNum = pieceData.playerNum
		

			 
				console.log("sent emit move Piece from index js");
					emitMovePiece(fromRow,fromCol,toRow,toCol,roomName,playerNum,io);
			
	}
		function handleRemovePiece(removePieceData)
		{
			console.log('inside handleRemovePiece')
			const removePieceRow = removePieceData.removedPieceRow;
			const removePieceCol = removePieceData.removedPieceColumn;
			const roomName = removePieceData.roomName;
			const playerNum = removePieceData.playerNum;
			console.log(removePieceRow);
			console.log(removePieceCol);
			console.log('roomName');
			console.log(roomName);
			console.log("playernum");
			console.log(playerNum);

			emitRemovePiece(removePieceRow,removePieceCol,roomName, playerNum, io);



		}

function handleWinMessage(WinMessage)
	{
	const	playerNum = WinMessage.playerNum;
	const	roomName = WinMessage.roomName;
		emitCheckersWinMessage(roomName,playerNum,io);
	}




	function handleBoardMove(stateData) {
		const roomName = stateData.roomName
		const board = stateData.board


		console.log('roomName');
		console.log(roomName);
		console.log('board');
		console.log(board);
		if (roomName && board) {
			emitGameState(roomName, board, io);
		}
	}

function handleturn(playermove){
	const roomName = playermove.roomName
	const playernum = playermove.player
console.log('roomName');
console.log(roomName);
console.log("playernum");
console.log(playernum);
	if (roomName && playernum){
	emitcheckersturn(roomName,playernum,io);
	}

}


}
function emitCheckersWinMessage(roomName,playerNum,io)
{
	console.log("sending win message", playerNum);
	io.in(roomName).emit('checkers-winmessage', playerNum);


}
function emitcheckersturn(roomName,playernum,io)
{
	io.in(roomName).emit('checkers-turnre', playernum);

}


 function emitMovePiece(fromRow,fromCol,toRow,toCol,roomName,playerNum,io)
{
	console.log('we are inside emit move piece');
	console.log("we are emiting move piece");
	io.in(roomName).emit('piece-move-update',{x1: fromRow, y1: fromCol,x2: toRow, y2:toCol, p:playerNum});
} 
function emitRemovePiece(removedPieceRow,removedPieceCol,roomName,playerNum,io)
{

	io.in(roomName).emit('piece-remove-update',{x1: removedPieceRow, y1: removedPieceCol, p: playerNum});
}
/**
 * Emits a game state to all players in a lobby
 * @param String The room code to send the state to 
 * @param Object The current game state for the checkers game 
 * @param Object A Socket.IO instance
 */
 function emitGameState(roomName, state, io) {
	io.in(roomName).emit('checkers-game-state', state);
}