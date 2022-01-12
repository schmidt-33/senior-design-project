'use strict';

const { makeId } = require("../utils");
const { Game } = require('./game');

let asteroidsState = {};
let asteroidsClientRooms = {};

module.exports = {
	asteroidsSocketEventHandler
}

function asteroidsSocketEventHandler(socket, io) {
	//?=== Socket Listeners ===//
	socket.on('asteroids-new-game', handleNewGame);

	//?=== Socket Handlers ===//
	function handleNewGame(data) {
		let codeInUse = true;
		let roomCode;
		while (codeInUse) {
			roomCode = makeId(5);
			//? Code not being used is found
			if (!asteroidsState.hasOwnProperty(roomCode)) codeInUse = false;
		}

		asteroidsClientRooms[socket.id] = roomCode;

		const game = new Game()
		const ship = game.createShip(socket.id);
		game.addShip(ship);
		game.createAsteroidField();

		asteroidsState[roomCode] = game;
		emitRoomCode(socket, roomCode);
	}
}

function emitRoomCode(socket, roomCode) {
	socket.emit(`asteroids-room-code`, { roomCode });
}

function gameInterval() {
	
}

function emitGameState(roomCode, io) {
	const game = asteroidsState[roomCode];
	const state = game.toJson();
	io.in(roomCode).emit('asteroids-game-state', state);
}