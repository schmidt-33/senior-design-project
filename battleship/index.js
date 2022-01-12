/**
import { emit } from 'process';
 * Author: Faten Alshohatee
 * Date: Sep.10.2021
 * File: index.js
 * Description: This file handles all socket and game state events for the battleship game
 */

'use strict';
module.exports = {
	battleshipSocketEventHandler
};

//? Global utilities
const { makeId } = require('../utils');

//? Game constants
const {

} = require('./constants');

//? Game utils
const {
	initBattleship,

} = require('./util');

//? State Mechanisms
let battleshipState = {};
let battleshipClientRooms = {};

// // Handle a socket connection request from web client
// const connections = [null, null]


/** 
 * This function listens to and handles all socket events for the game snake
 * @param socket A Socket.IO socket object 
 * @param io A Socket.IO instance 
 */

function battleshipSocketEventHandler(socket, io) {
	//?=== Socket Listeners ===//

	
	socket.on('battleship-new-game', handleNewGameBattleship);
	socket.on('battleship-join-game', handleJoinGameBattleship);
	socket.on('battleship-rematch', handleRematchBattleship);
 	/* socket.on('battleship-turns', handleturn); */
	socket.on('battleship-readyup',handleReadyUp); 
	socket.on('battleship-shoot', handleShoot);
	socket.on('battleship-shoot-result',handleShootResult);
	//?=== Socket Handlers ===//
	function handleNewGameBattleship() {
		//? create a new room ID
		const roomName = makeId(5);
		//? Track what room the user is in
		battleshipClientRooms[socket.id] = roomName;
		//? Send room code to the user
		socket.emit('battleship-game-code', { gameCode: roomName });

		//? Initialize game state
		battleshipState[roomName] = initBattleship;

		//? Add socket to the room
		socket.join(roomName);
		//? Assign them a player number
		socket.number = 1;
		//? Send the player their number
		socket.emit('battleship-init', { playerNumber: 1 });
	}

	function handleJoinGameBattleship(userData) {
		//? If there is no game code or game code present, send unknown code request
		if (!userData || !userData.gameCode) {
			socket.emit('battleship-unknown-game', 'Unknown Game');
		}

		//? Look for the room the user is requesting
		const room = io.sockets.adapter.rooms.get(userData.gameCode);

		//? If ther is no room or the room is empty, send unknown code response
		if (!room || room.size == 0 || !battleshipState[userData.gameCode]) {
			socket.emit('battleship-unknown-game', 'Unknown Game');
			return;
		}
		else if (room.size > 1) {
			//? Room is already full
			socket.emit('battleship-too-many-palyers', 'Too many players');
			return;
		}

		//? Track which room the user is joining
		battleshipClientRooms[socket.id] = userData.gameCode;
		//? joing room
		socket.join(userData.gameCode);
		//? Assign them player 2
		socket.number = 2;
		//? Emit the initialization of a new player
		socket.emit('battleship-init', { playerNumber: 2 });

		// startGameInterval(userData.gameCode, io);
	}

	function handleRematchBattleship(userData) {
		//? Ensure user data was passed
		if (!userData || !userData.gameCode) return;

		const { gameCode } = userData;

		//? Determine if a new game stat has been created for a rematch
		if (battleshipState[gameCode] && battleshipState[gameCode].rematchVotes) {
			//? If one player has already voted for a rematch
			if (!battleshipState[gameCode].rematchVotes.includes(socket.id)) {
				;
				io.in(gameCode).emit(`battleship-rematch-count`, { rematchCount: battleshipState[gameCode].rematchVotes.length });
				battleshipState[gameCode].rematchVotes.push(socket.id);
			}

			//? If the second user has accepted, begin the game
			if (battleshipState[gameCode].rematchVotes.length === 2) {
				io.in(gameCode).emit(`battleship-rematch-count`, { rematchCount: battleshipState[gameCode].rematchVotes.length });
				startGameInterval(gameCode, io);
			}
		}
		else {
			//? Initialize a new state
			battleshipState[gameCode] = initGame();
			battleshipState[gameCode].rematchVotes = [socket.id];
			io.in(gameCode).emit('battleship-rematch-count', { rematchCount: snakeState[gameCode].rematchVotes.length });
		}
	}
	function handleShoot(data)
	{	console.log('logging data for shot fired inside handle shoot function');
		const roomName = data.roomName;
		console.log(roomName);
		const id=data.shotFired;
		console.log(id);
		const playerNumber = data.playerNumber;
		console.log(playerNumber);

		
		emitbattleshipShootToEnemy(roomName,id,playerNumber,io )
	}
	function handleShootResult(data){
		const roomName = data.roomName;
		
		const id= data.shotFired;
		const shipName = data.shipName
		const hit= data.hit;
		const playerNumber = data.playerNumber;

		console.log(roomName);
		console.log(id);
		console.log(shipName);
		console.log(hit)
		console.log(playerNumber);

		emitbattleshipShootResultBackToShooter(roomName ,id,shipName,hit, playerNumber,io);
	}

	/* function handleturn(playermove) {
		const roomName = playermove.roomName
		const playernum = playermove.player
		console.log('roomName');
		console.log(roomName);
		console.log("playernum");
		console.log(playernum);
		if (roomName && playernum) {
			emitbattleshipturn(roomName, playernum, io);
		}
	} */
	function handleReadyUp(data){
		const roomName=data.roomName;
		console.log(roomName);
		const playerNumber = data.playerNumber;
		console.log(playerNumber);
		emitbattleshipreadyupAll(roomName,playerNumber, io)



	}
}

function emitbattleshipturn(roomName, playernum, io) {
	io.in(roomName).emit('battleship-turnre', playernum);
}


/**
 * Emits a game state to all players in a lobby
 * @param String The room code to send the state to 
 * @param Object The current game state for the battleship game 
 * @param Object A Socket.IO instance
 */
function emitGameState(roomName, state, io) {
	io.in(roomName).emit('battleship-game-state', state);
}
function emitbattleshipreadyupAll(roomName,playerNumber, io)
{
	console.log('attemptingready up all ');
	console.log(playerNumber);
	io.in(roomName).emit('battleship-ready-up-all',playerNumber);


}
function emitbattleshipShootToEnemy(roomName,id,playerNumber,io ){



io.in(roomName).emit('battleship-shoot-enemy-receive',{x1: id, x2:playerNumber});

}
function emitbattleshipShootResultBackToShooter(roomName ,id,shipName,hit, playerNumber,io)
{
	console.log(playerNumber);
	io.in(roomName).emit('battleship-shoot-result-receive',{x1: id, x2: shipName, x3: hit, x4: playerNumber });


}