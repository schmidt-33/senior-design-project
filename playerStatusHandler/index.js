/**
 * Author: Jakob Taylor
 * Date: Jun.24.2021
 * File: index.js
 * Description: This file handles all socket events to control a player's status (online, in-game, etc.)
 */
'use strict';
module.exports = {
	playerStatusEventHandler
};

//? Global utilities

//? Game constants
const {
} = require('./constants');

//? Game utils
const {
} = require('./util');

//? Track the number of users online
let onlineCount = 0;

//? Track the number of users in game
let inGameCount = {};

/** 
 * This function listens to and handles all socket events for the game snake
 * @param socket A Socket.IO socket object 
 * @param io A Socket.IO instance 
 */
function playerStatusEventHandler(socket, io) {
	//? This function will be be executed with every socket connection
	incrementOnlineCount(socket);

	//?=== Socket Listeners ===//
	socket.on(`online-count`, handleOnlineCountRequest);
	socket.on(`in-game-event`, handleInGameEvent);
	socket.on(`in-game-event-single`, handleInGameEventForUserRequest);
	socket.on(`disconnect`, decrementOnlineCount);
	// //
	// //
	//?=== Socket Handlers ===//
	function handleInGameEvent() {
		return;
	}

	function handleInGameEventForUserRequest() {
		return;
	}

	function decrementOnlineCount() {
		onlineCount--;
		if (onlineCount < 0) onlineCount = 0;
		socket.emit(`online-count`, { count: onlineCount })
		socket.broadcast.emit(`online-count`, { count: onlineCount })
	}

	function handleOnlineCountRequest() {
		socket.emit(`online-count`, { count: onlineCount })
	}
}

/**
 * Emits an IO socket event to all connected users with an updated increased online count
 * @param socket A Socket.IO socket object
 */
function incrementOnlineCount(socket) {
	onlineCount++;
	//? Send an online count event to all connected 
	socket.emit(`online-count`, { count: onlineCount })
	socket.broadcast.emit(`online-count`, { count: onlineCount })
}