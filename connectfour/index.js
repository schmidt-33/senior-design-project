/**
 * Author: Faten Alshohatee
 * Date: Nov.10.2021
 * File: index.js
 * Description: This file handles all socket and game state events for the connect-four game
 */

'use strict';
module.exports = {
	connectfourSocketEventHandler
};

//? Global utilities
const { makeId } = require('../utils');

//? Game constants
const {

} = require('./constants');

//? Game utils
const {
	initConnectfour,

} = require('./util');

//? State Mechanisms
let connectfourState = {};
let connectfourClientRooms = {};

// // Handle a socket connection request from web client
// const connections = [null, null]


/** 
 * This function listens to and handles all socket events for the game 
 * @param socket A Socket.IO socket object 
 * @param io A Socket.IO instance 
 */

function connectfourSocketEventHandler(socket, io) {
	//?=== Socket Listeners ===//

	
	socket.on('connectfour-new-game', handleNewGameConnectfour);
	socket.on('connectfour-join-game', handleJoinGameConnectfour);
	socket.on('connectfour-rematch', handleRematchConnectfour);
	socket.on('connectfour-turns', handleturn);
	socket.on('connectfour-turnse',handleSendPiece);

	//?=== Socket Handlers ===//
	function handleNewGameConnectfour() {
		//? create a new room ID
		const roomName = makeId(5);
		//? Track what room the user is in
		connectfourClientRooms[socket.id] = roomName;
		//? Send room code to the user
		socket.emit('connectfour-game-code', { gameCode: roomName });

		//? Initialize game state
		connectfourState[roomName] = initConnectfour;

		//? Add socket to the room
		socket.join(roomName);
		//? Assign them a player number
		socket.number = 1;
		//? Send the player their number
		socket.emit('connectfour-init', { playerNumber: 1 });
	}

	function handleJoinGameConnectfour(userData) {
		//? If there is no game code or game code present, send unknown code request
		if (!userData || !userData.gameCode) {
			socket.emit('connectfour-unknown-game', 'Unknown Game');
		}

		//? Look for the room the user is requesting
		const room = io.sockets.adapter.rooms.get(userData.gameCode);

		//? If ther is no room or the room is empty, send unknown code response
		if (!room || room.size == 0 || !connectfourState[userData.gameCode]) {
			socket.emit('connectfour-unknown-game', 'Unknown Game');
			return;
		}
		else if (room.size > 1) {
			//? Room is already full
			socket.emit('connectfour-too-many-palyers', 'Too many players');
			return;
		}

		//? Track which room the user is joining
		connectfourClientRooms[socket.id] = userData.gameCode;
		//? joing room
		socket.join(userData.gameCode);
		//? Assign them player 2
		socket.number = 2;
		//? Emit the initialization of a new player
		socket.emit('connectfour-init', { playerNumber: 2 });

		// startGameInterval(userData.gameCode, io);
	}

	function handleRematchConnectfour(userData) {
		//? Ensure user data was passed
		if (!userData || !userData.gameCode) return;

		const { gameCode } = userData;

		//? Determine if a new game stat has been created for a rematch
		if (connectfourState[gameCode] && connectfourState[gameCode].rematchVotes) {
			//? If one player has already voted for a rematch
			if (!connectfourState[gameCode].rematchVotes.includes(socket.id)) {
				;
				io.in(gameCode).emit(`connectfour-rematch-count`, { rematchCount: connectfourState[gameCode].rematchVotes.length });
				connectfourState[gameCode].rematchVotes.push(socket.id);
			}

			//? If the second user has accepted, begin the game
			if (connectfourState[gameCode].rematchVotes.length === 2) {
				io.in(gameCode).emit(`connectfour-rematch-count`, { rematchCount: connectfourState[gameCode].rematchVotes.length });
				//startGameInterval(gameCode, io);
			}
		}
		else {
			//? Initialize a new state
			connectfourState[gameCode] = initGame();
			connectfourState[gameCode].rematchVotes = [socket.id];
			io.in(gameCode).emit('connectfour-rematch-count', { rematchCount: snakeState[gameCode].rematchVotes.length });
		}
	}

	function handleSendPiece(data)
	{ const roomName = data.roomName;
		const column = data.column;
		const playerNumber = data.playerNumber;


		emitpiecedata(roomName, column, playerNumber, io);

	}




	function handleturn(playermove) {
		const roomName = playermove.roomName
		const playernum = playermove.player
		console.log('roomName');
		console.log(roomName);
		console.log("playernum");
		console.log(playernum);
		if (roomName && playernum) {
			emitConnectfourturn(roomName, playernum, io);
		}
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

}


function emitConnectfourturn(roomName, playernum, io) {
	io.in(roomName).emit('connectfour-turnre', playernum);
}


/**
 * Emits a game state to all players in a lobby
 * @param String The room code to send the state to 
 * @param Object The current game state for the connectfour game 
 * @param Object A Socket.IO instance
 */
function emitGameState(roomName, state, io) {
	io.in(roomName).emit('connectfour-game-state', state);
}

function emitpiecedata(roomName, column, playerNumber, io)
{

	io.in(roomName).emit('connectfour-peice-data', { x1: column, x2: playerNumber,});

}

