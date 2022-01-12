/**
 * Author: Jakob Taylor
 * Date: Jun.18.2021
 * File: index.js
 * Description: This file handles all socket and game state events for the snake game
 */
'use strict';
module.exports = {
	snakeSocketEventHandler
};

//? Global utilities
const { makeId } = require('../utils');

//? Game constants
const {
	FRAME_RATE,
	THREE_SECONDS
} = require('./constants');

//? Game utils
const {
	gameLoop,
	getUpdatedVelocity,
	initGame
} = require('./util');

//? State Mechanisms
let snakeState = {};
let snakeClientRooms = {};

/** 
 * This function listens to and handles all socket events for the game snake
 * @param socket A Socket.IO socket object 
 * @param io A Socket.IO instance 
 */
function snakeSocketEventHandler(socket, io) {
	//?=== Socket Listeners ===//
	socket.on(`snake-key-down`, handleKeyDown);
	socket.on(`snake-new-game`, handleNewGame);
	socket.on(`snake-join-game`, handleJoinGame);
	socket.on(`snake-rematch`, handleRematch);
	// //x
	// //
	//?=== Socket Handlers ===//
	function handleKeyDown(keyCode) {
		keyCode = keyCode['keyCode'];
		//? Get the room name of the current user
		const roomName = snakeClientRooms[socket.id];

		//? If the room name was not found for the user, Ignore the request
		if (!roomName || snakeState[roomName] === null) return;

		//? Ensure the beginning countdown has finished before tracking inputs
		if (!snakeState[roomName] ||
			!snakeState[roomName].frames ||
			!snakeState[roomName].frames > THREE_SECONDS
		) return;

		//? Get the key pressed on the keyboard by integer
		try {
			keyCode = parseInt(keyCode);

			//? Ensure the keycode is valid key code before continuing
			if (keyCode < 0) throw new Error("Invalid Keycode Found");

			//? Update the user's velocity
			const vel = getUpdatedVelocity(keyCode);

			//? Ensure the key pressed isn't the opposite of the direction they are moving in now
			//? This prevents them from losing by backing up into themselves
			if (vel.x + snakeState[roomName].players[socket.number - 1].vel.x === 0 ||
				vel.y + snakeState[roomName].players[socket.number - 1].vel.y === 0
			) {
				return;
			}
			snakeState[roomName].players[socket.number - 1].vel = vel
		}
		catch (e) {
			console.error(e);
			return;
		}
	}

	function handleNewGame(userData) {
		//? Create a new room ID
		const roomName = makeId(5);
		//? Track what room the user is in
		snakeClientRooms[socket.id] = roomName;
		//? Send the room code back to the user
		socket.emit('snake-game-code', { gameCode: roomName });

		//? Initialize the game state
		snakeState[roomName] = initGame();
		//? Assign the player's snake the color they chose
		snakeState[roomName].players[0].color = userData.color

		//? Add the socket to the room
		socket.join(roomName);
		//? Assign them a player number
		socket.number = 1;
		//? send the player their number
		socket.emit('snake-init', { playerNumber: 1 });
	}

	function handleJoinGame(userData) {
		//? If there is no game code present, send an unknown code request
		if (!userData || !userData.gameCode) {
			socket.emit(`snake-unknown-game`, 'Unknown Game');
		}

		//? Look for the room that the user is requesting
		const room = io.sockets.adapter.rooms.get(userData.gameCode);

		//? If there is no room or the room is empty, send an unknown code response
		if (!room || room.size === 0 || !snakeState[userData.gameCode]) {
			socket.emit(`snake-unknown-game`, 'Unknown Game');
			return;
		}
		else if (room.size > 1) {
			//? Room is already full
			socket.emit(`snake-too-many-players`, `Too many players`);
			return;
		}

		//? Track which room user is joining
		snakeClientRooms[socket.id] = userData.gameCode;
		//? Join the room
		socket.join(userData.gameCode);
		//? Assign them player 2
		socket.number = 2;
		//? Emit the initialization of a new player
		socket.emit(`snake-init`, { playerNumber: 2 });
		//? Assign the snake color they chose
		snakeState[userData.gameCode].players[1].color = userData.color;
		//? Begin to track the number of frames that have ocurred
		//? This is to track the countdown to the players
		snakeState[userData.gameCode].frames = 0;
		startGameInterval(userData.gameCode, io);
	}

	function handleRematch(userData) {
		//? Ensure the user data was passed
		if (!userData || !userData.gameCode || !userData.color) return;

		const { gameCode, color } = userData;

		//? Determine if a new game state has been created for a rematch
		if (snakeState[gameCode] && snakeState[gameCode].rematchVotes) {
			//? If one user has already voted to a rematch
			if (!snakeState[gameCode].rematchVotes.includes(socket.id)) {;
				io.in(gameCode).emit(`snake-rematch-count`, { rematchCount: snakeState[gameCode].rematchVotes.length });
				snakeState[gameCode].rematchVotes.push(socket.id);
				snakeState[gameCode].players[1].color = color;
			}

			//? If the second user has accepted, begin the game
			if (snakeState[gameCode].rematchVotes.length === 2) {
				io.in(gameCode).emit(`snake-rematch-count`, { rematchCount: snakeState[gameCode].rematchVotes.length });
				startGameInterval(gameCode, io);
			}
		}
		else {
			//? Initialize a new state
			snakeState[gameCode] = initGame();
			snakeState[gameCode].frames = 0
			snakeState[gameCode].rematchVotes = [socket.id];
			snakeState[gameCode].players[0].color = color;
			io.in(gameCode).emit('snake-rematch-count', { rematchCount: snakeState[gameCode].rematchVotes.length });
		}
	}
}

/**
 * A function to begin the new game interval for a multiplayer game. Determines a winner and loser
 * @param String The room code to start an interval for
 * @param Object A Socket.IO instance 
 */
function startGameInterval(roomName, io) {
	const intervalId = setInterval(() => {
		snakeState[roomName].frames++;
		//? See if the countdown has finished
		if (snakeState[roomName].frames++ <= THREE_SECONDS) {
			//? If it is not, send the game state as is
			emitGameState(roomName, snakeState[roomName], io);
		}
		else {
			//? Determine if there is a winner
			const winner = gameLoop(snakeState[roomName]);
			if (!winner) {
				//? No winner, game continues
				emitGameState(roomName, snakeState[roomName], io);
			}
			else {
				//? Winner found, end the game
				emitGameOver(roomName, winner, io);
				delete snakeState[roomName];
				clearInterval(intervalId);
			}
		}
	}, 1000 / FRAME_RATE);
}


/**
 * Emits a game state to all players in a lobby
 * @param String The room code to send the state to 
 * @param Object The current game state for the snake game 
 * @param Object A Socket.IO instance
 */
function emitGameState(roomName, state, io) {
	io.in(roomName).emit('snake-game-state', state);
}

/**
 * Emits a game over state to all players in a lobby
 * @param String The room code to send the state to 
 * @param Object The current game state for the snake game 
 * @param Object A Socket.IO instance
 * @param number The player number of who won
 */
function emitGameOver(roomName, winner, io) {
	io.in(roomName).emit('snake-game-over', { winner });
	
}