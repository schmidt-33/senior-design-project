/**
 * Author: Alec Schmidt
 * Date: Nov.7.2021
 * File: index.js
 * Description: This file handles all socket and game state events for the tetris game
 */

 'use strict';
 module.exports ={
	 tetrisSocketEventHandler 
 };

 //? Global Utilities
const { makeId } = require('../utils');

//?Game utils
const {
	initTetris

} = require('./util');

//? State Mechanisms
let tetrisState = {};
let tetrisClientRooms = {};

/** 
 * This function listens to and handles all socket events for the game snake
 * @param socket A Socket.IO socket object 
 * @param io A Socket.IO instance 
 */

 function tetrisSocketEventHandler(socket, io) {
	 //?=== Socket Listeners ===//
	socket.on(`tetris-new-game`, handleNewGame);
	socket.on(`tetris-join-game`, handleJoinGame);
	socket.on(`tetris-rematch`, handleRematch);

	//?=== Socket Handlers ===//
	function handleNewGame(userData) {
		//? Create a new room ID
		const roomName = makeId(5);
		//? Track what room the user is in
		tetrisClientRooms[socket.id] = roomName;
		//? Send the room code back to the user
		socket.emit('tetris-game-code', { gameCode: roomName });

		//? Initialize the game state
		tetrisState[roomName] = initTetris();

		//? Add the socket to the room
		socket.join(roomName);
		//? Assign them a player number
		socket.number = 1;
		//? send the player their number
		socket.emit('tetris-init', {playerNumber: 1});
	}

	function handleJoinGame(userData) {

	}

	function handleRematch(userData) {

	}
 }