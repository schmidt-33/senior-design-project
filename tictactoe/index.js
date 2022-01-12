/**
 * Author: Nick Eby
 * Date: Aug.21.2021
 * File: index.js
 * Description: This file handles all socket and game state events for the tictactoe game
 */

'use strict';
module.exports = {
	tictactoeSocketEventHandler,
};

const { stat } = require('fs');
//? Global utilities
const { makeId } = require('../utils');

//? Game constants
const {

} = require('./constants');

//? Game utils
const {
	initTictactoe,
} = require('./util');

//? State Mechanisms
let tictactoeState = {};
let tictactoeClientRooms = {};

/** 
 * This function listens to and handles all socket events for the game tictactoe
 * @param socket A Socket.IO socket object 
 * @param io A Socket.IO instance 
 */
function tictactoeSocketEventHandler(socket, io) {
    //?=== Socket Listeners ===//
    socket.on('tictactoe-new-game', handleNewGameTictactoe);
    socket.on('tictactoe-join-game', handleJoinGameTictactoe);
    socket.on('tictactoe-rematch', handleRematchTictactoe);
    socket.on('tictactoe-choose-square', chooseSquareTictactoe);
    
    //?=== Socket Handlers ===//
    function handleNewGameTictactoe() {
        //? create a new room ID
        const roomName = makeId(5);

        //? Track what room the user is in
        tictactoeClientRooms[socket.id] = roomName;

        //? Send room code to the user
        socket.emit('tictactoe-game-code', {gameCode: roomName});

        //? Initialize game state
        tictactoeState[roomName] = initTictactoe();

		//? Add socket to the room
        socket.join(roomName);
		//? Assign them a player number
        socket.number = 1;
		//? Send the player their number
        socket.emit('tictactoe-init', { playerNumber: 1 });
        
    }

    function handleJoinGameTictactoe(userData) {
        //? If there is no game code present, send an unknown code request
		if (!userData || !userData.gameCode) {
			socket.emit(`tictactoe-unknown-game`, 'Unknown Game');
        }

		//? Look for the room that the user is requesting
        const room = io.sockets.adapter.rooms.get(userData.gameCode);

		//? If there is no room or the room is empty, send an unknown code response
		if (!room || room.size === 0 || !tictactoeState[userData.gameCode]) {
			socket.emit(`tictactoe-unknown-game`, 'Unknown Game');
			return;
		}
		else if (room.size > 1) {
			//? Room is already full since two player game
			socket.emit(`tictactoe-too-many-players`, `Too many players`);
			return;
		}

		//? Track which room user is joining
        tictactoeClientRooms[socket.id] = userData.gameCode;
		//? Join the room
		socket.join(userData.gameCode);
		//? Assign them player 2
		socket.number = 2;
		//? Emit the initialization of a new player
        socket.emit(`tictactoe-init`, { playerNumber: 2 });

        //? randomize turn and emit so both client states are on the same page
        tictactoeState[userData.gameCode].turn = Math.random() < 0.5;
        //console.log(tictactoeState[userData.gameCode].turn);
        emitGameState(userData.gameCode, tictactoeState[userData.gameCode], io);
    }

    function handleRematchTictactoe(userData) {
        //? Ensure user data was passed
		if (!userData || !userData.gameCode) return;

		const { gameCode } = userData;

		//? Determine if a new game state has been created for a rematch
		if (tictactoeState[gameCode] && tictactoeState[gameCode].rematchVotes) {
			//? If one user has already voted to a rematch
			if (!tictactoeState[gameCode].rematchVotes.includes(socket.id)) {
				io.in(gameCode).emit(`tictactoe-rematch-count`, { rematchCount: tictactoeState[gameCode].rematchVotes.length });
				tictactoeState[gameCode].rematchVotes.push(socket.id);
			}

			//? If the second user has accepted, begin the game
			if (tictactoeState[gameCode].rematchVotes.length === 2) {
                io.in(gameCode).emit(`tictactoe-rematch-count`, { rematchCount: tictactoeState[gameCode].rematchVotes.length });
                
                // initilaize board by passing in correct turn value
                tictactoeState[gameCode] = initTictactoe(userData.playerTurn); // reset game state for rematch; turn property passed to function
                resetBoard(gameCode, tictactoeState[gameCode], io);
			}
		}
		else {
			//? Initialize a new state
			tictactoeState[gameCode] = initTictactoe(tictactoeState[gameCode.turn]);
			tictactoeState[gameCode].rematchVotes = [socket.id];
			io.in(gameCode).emit('tictactoe-rematch-count', { rematchCount: tictactoeState[gameCode].rematchVotes.length });
		}
    }


    function chooseSquareTictactoe(data) {
        // listens for which square is clicked, updates JSON board object, calls emitGameState

        const roomName = tictactoeClientRooms[socket.id];

		//? If the room name was not found for the user, Ignore the request
        if (!roomName || tictactoeState[roomName] === null) return;

        // set gameState turn
        tictactoeState[roomName].turn = data.turn;

        // switch text
        this.currentText = tictactoeState[roomName].turn ? 'X' : 'O';

        // set id value to current text
        tictactoeState[roomName].board[data.id] = this.currentText;
        
        // switch turn
        tictactoeState[roomName].turn = !data.turn;

        emitGameState(roomName, tictactoeState[roomName], io);
        const winner = checkWinner(roomName, tictactoeState[roomName], io);
        if (winner !== 0) {
            emitGameOver(roomName, winner, io);
            delete tictactoeState[roomName];
        }
    }
}


/**
 * Checks for winner and calls reset board for game over or for CAT
 * @param String the room code to send the state to
 * @param Object The current game state for tictactoe game
 * @param Object a socket.IO instance
 * @returns Number representing winner (1 or 2) or 0 for no winner yet
 */
function checkWinner(room, state, io) {
    var text = state.turn ? 'O' : 'X'; // turn already switched so checking opposite
    var player = state.turn ? 2 : 1; // same thing here
    if (state.board[0] === text && state.board[1] === text && state.board[2] === text) { // top
        return player;
    }
    if (state.board[3] === text && state.board[4] === text && state.board[5] === text) { // middle horizontal
        return player;
    }
    if (state.board[6] === text && state.board[7] === text && state.board[8] === text) { // bottom
        return player;
    }
    if (state.board[0] === text && state.board[3] === text && state.board[6] === text) { // left
        return player;
    }
    if (state.board[1] === text && state.board[4] === text && state.board[7] === text) { // middle vertical
        return player;
    }
    if (state.board[2] === text && state.board[5] === text && state.board[8] === text) { // right
        return player;
    }
    if (state.board[0] === text && state.board[4] === text && state.board[8] === text) { // diagonal
        return player;
    }
    if (state.board[2] === text && state.board[4] === text && state.board[6] === text) { // diagonal
        return player;
    }
    if (state.board[0] !== '' && state.board[1] !== '' && state.board[2] !== '' && state.board[3] !== '' && state.board[4] !== '' && state.board[5] !== '' && state.board[6] !== '' && state.board[7] !== '' && state.board[8] !== '') { // cat
        resetBoard(room, state, io);
        return -1;
    }
    return 0;
}

/**
 * Resets board after game over or after CAT, emits game state to show empty board
 * @param String the room code to send the state to
 * @param Object The current game state for tictactoe game
 * @param Object a socket.IO instance
 */
function resetBoard(room, state, io) {
    for (var i = 0; i < 9; i++) {
        state.board[i] = '';
    }
    emitGameState(room, state, io);
}

/**
 * Emits a game state to all players in a lobby
 * @param String The room code to send the state to 
 * @param Object The current game state for the tictactoe game 
 * @param Object A Socket.IO instance
 */
function emitGameState(roomName, state, io) {
    io.in(roomName).emit('tictactoe-game-state', state);
}

/**
 * Emits a game over state to all players in a lobby
 * @param String The room code to send the state to 
 * @param Object The current game state for the tictactoe game 
 * @param Object A Socket.IO instance
 * @param number The player number of who won
 */
function emitGameOver(roomName, winner, io) {
	io.in(roomName).emit('tictactoe-game-over', { winner });
}