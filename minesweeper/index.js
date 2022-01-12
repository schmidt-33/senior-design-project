/**
 * Author: Nick Eby
 * Date: Oct.26.2021
 * File: index.js
 * Description: This file handles all socket and game state events for the minesweeper game
 */

// ADDITIONAL FEATURES
    // ADD MODES FOR BEGINNER, INTERMEDIATE, EXPERT --> 8x8 with 10 mines is current implementation ie Beginner, 16x16 with 40 mines would be Intermediate, 22x22 with 99 mines would be Expert
    // ADD tie finish if only squares left are bombs, i do not have this currently
    // Other feature -> add algorithm to compute nearby 0's when a number is clicked

 'use strict';
 module.exports = {
     minesweeperSocketEventHandler,
 };
 
const { clear } = require('console');
 const { stat } = require('fs');
const { TIME_LEFT, } = require('../snake/constants');
 //? Global utilities
 const { makeId } = require('../utils');

 
 //? Game utils
 const {
     initMinesweeper,
 } = require('./util');
 
 //? State Mechanisms
 let minesweeperState = {};
 let minesweeperClientRooms = {};

 let isGameOver = false;
 
 /** 
  * This function listens to and handles all socket events for the game minesweeper
  * @param socket A Socket.IO socket object 
  * @param io A Socket.IO instance 
  */
 function minesweeperSocketEventHandler(socket, io) {
     //?=== Socket Listeners ===//
     socket.on('minesweeper-new-game', handleNewGameMinesweeper);
     socket.on('minesweeper-join-game', handleJoinGameMinesweeper);
     socket.on('minesweeper-rematch', handleRematchMinesweeper);
     socket.on('minesweeper-choose-square', chooseSquareMinesweeper);
     
     //?=== Socket Handlers ===//
     function handleNewGameMinesweeper() {
         //? create a new room ID
         const roomName = makeId(5);
 
         //? Track what room the user is in
         minesweeperClientRooms[socket.id] = roomName;
 
         //? Send room code to the user
         socket.emit('minesweeper-game-code', {gameCode: roomName});
 
         //? Initialize game state
         minesweeperState[roomName] = initMinesweeper();

         // randomize state
         randomizeState(minesweeperState[roomName]);
 
         //? Add socket to the room
         socket.join(roomName);
         //? Assign them a player number
         socket.number = 1;
         //? Send the player their number
         socket.emit('minesweeper-init', { playerNumber: 1 });
         
     }
 
     function handleJoinGameMinesweeper(userData) {
         //? If there is no game code present, send an unknown code request
         if (!userData || !userData.gameCode) {
             socket.emit(`minesweeper-unknown-game`, 'Unknown Game');
         }
 
         //? Look for the room that the user is requesting
         const room = io.sockets.adapter.rooms.get(userData.gameCode);
 
         //? If there is no room or the room is empty, send an unknown code response
         if (!room || room.size === 0 || !minesweeperState[userData.gameCode]) {
             socket.emit(`minesweeper-unknown-game`, 'Unknown Game');
             return;
         }
         else if (room.size > 1) {
             //? Room is already full since two player game
             socket.emit(`minesweeper-too-many-players`, `Too many players`);
             return;
         }
 
         //? Track which room user is joining
         minesweeperClientRooms[socket.id] = userData.gameCode;
         //? Join the room
         socket.join(userData.gameCode);
         //? Assign them player 2
         socket.number = 2;
         //? Emit the initialization of a new player
         socket.emit(`minesweeper-init`, { playerNumber: 2 });

        emitGameState(userData.gameCode, minesweeperState[userData.gameCode], io);
        isGameOver = false;
        timer(userData.gameCode, io);
     }
 
     function handleRematchMinesweeper(userData) {
         //? Ensure user data was passed
         if (!userData || !userData.gameCode) return;
 
         const { gameCode } = userData;
 
         //? Determine if a new game state has been created for a rematch
         if (minesweeperState[gameCode] && minesweeperState[gameCode].rematchVotes) {
             //? If one user has already voted to a rematch
             if (!minesweeperState[gameCode].rematchVotes.includes(socket.id)) {
                 io.in(gameCode).emit(`minesweeper-rematch-count`, { rematchCount: minesweeperState[gameCode].rematchVotes.length });
                 minesweeperState[gameCode].rematchVotes.push(socket.id);
             }
 
             //? If the second user has accepted, begin the game
             if (minesweeperState[gameCode].rematchVotes.length === 2) {
                 io.in(gameCode).emit(`minesweeper-rematch-count`, { rematchCount: minesweeperState[gameCode].rematchVotes.length });
                 
                 // initilaize board by passing in correct turn value
                 minesweeperState[gameCode] = initMinesweeper(); // reset game state for rematch
                 randomizeState(minesweeperState[gameCode]);
                 emitGameState(gameCode, minesweeperState[gameCode], io);
                 isGameOver = false;
                 timer(userData.gameCode, io);
             }
         }
         else {
             //? Initialize a new state
             minesweeperState[gameCode] = initMinesweeper(minesweeperState[gameCode.turn]);
             minesweeperState[gameCode].rematchVotes = [socket.id];
             io.in(gameCode).emit('minesweeper-rematch-count', { rematchCount: minesweeperState[gameCode].rematchVotes.length });
         }
     }
 
 
     function chooseSquareMinesweeper(data) {
         // listens for which square is clicked, updates JSON board object, calls emitGameState
 
         const roomName = minesweeperClientRooms[socket.id];
 
         //? If the room name was not found for the user, Ignore the request
         if (!roomName || minesweeperState[roomName] === null) return;
 
         // set value to no longer hidden
         minesweeperState[roomName].board[data.id].hidden = false;

         // each time a square is chosen, reset the time
         minesweeperState[roomName].time = 25; // issue with TIME_LEFT constant not working

        if (minesweeperState[roomName].board[data.id].val === 'X') {
            let winner = data.turn ? 2 : 1; // true is P1 and false is P2 so if true passed in as data.turn it means P1 clicked a bomb square so player 2 wins
            emitGameState(roomName, minesweeperState[roomName], io);
            emitGameOver(roomName, winner, io);
            isGameOver = true;
            delete minesweeperState[roomName]; // issues deleting state
         } else {
            // switch turn
            minesweeperState[roomName].turn = !data.turn;

            emitGameState(roomName, minesweeperState[roomName], io);
         }
         
         
     }
 }
 


/**
 * A function to keep a timer to add pressure for players
 * @param String The room code to start an interval for
 * @param Object A Socket.IO instance 
 */
 function timer(roomName, io) {
	const intervalId = setInterval(() => {
        if (isGameOver) {
            clearInterval(intervalId);
        } else {
            minesweeperState[roomName].time--;
            emitGameState(roomName, minesweeperState[roomName], io);
            // time runs out so player random unclicked square decided for player
            if (minesweeperState[roomName].time === 0) {
                // random square that is still hidden
                let randNum = Math.floor(Math.random() * 64) + 1;
                while (minesweeperState[roomName].board[randNum].hidden === false) {
                    randNum = Math.floor(Math.random() * 64) + 1;
                }
                if (minesweeperState[roomName].board[randNum].val === 'X') {
                    let winner = minesweeperState[roomName].turn ? 2 : 1;
                    minesweeperState[roomName].board[randNum].hidden = false;
                    emitGameState(roomName, minesweeperState[roomName], io);
                    emitGameOver(roomName, winner, io);
                    isGameOver = true;
                    clearInterval(intervalId);
                } else {
                    minesweeperState[roomName].board[randNum].hidden = false;
                    minesweeperState[roomName].turn = !(minesweeperState[roomName].turn);
                    minesweeperState[roomName].time = 25;
                }
            }


        }

	}, 1000);
}

 
 /**
  * Randomizes the board to create new bomb placements each game
  * @param State the initial state with its default values
  */
 function randomizeState(state) {
     let arr = [];
     while (arr.length < 10) {
        var random = Math.floor(Math.random() * 64) + 1;
        if (arr.indexOf(random) === -1) {
            arr.push(random);
        }
     }
     // write X to val to signify bomb
     for (let i = 0; i < 10; i++) {
         let temp = arr[i].toString();
         state.board[temp].val = "X";
     }
     // randomize who goes first
     state.turn = Math.random() < 0.5;
     
     // formatting for determining proximity to mines
                // -9  -8  -7
                // -1  Num +1
                // +7  +8  +9

     // value for number of mines nearby
     let squareTotal;
     // iterate through and determine empty square values
     for (let i = 1; i < 65; i++) {
        squareTotal = 0;
        if (state.board[i].val === 'X') {
            continue;
        }
        // first check if val exists, if it does check if equal to 'X', if it is increment squareTotal
        if ((i-9).toString() in state.board) {
            if (state.board[i-9].val === 'X') { squareTotal++;}
        }
        if ((i-8).toString() in state.board) {
            if (state.board[i-8].val === 'X') { squareTotal++;}
        }
        if ((i-7).toString() in state.board) {
            if (state.board[i-7].val === 'X') { squareTotal++;}
        }
        if ((i+9).toString() in state.board) {
            if (state.board[i+9].val === 'X') { squareTotal++;}
        }
        if ((i+8).toString() in state.board) {
            if (state.board[i+8].val === 'X') { squareTotal++;}
        }
        if ((i+7).toString() in state.board) {
            if (state.board[i+7].val === 'X') { squareTotal++;}
        }
        if ((i-1).toString() in state.board) {
            if (state.board[i-1].val === 'X') { squareTotal++;}
        }
        if ((i+1).toString() in state.board) {
            if (state.board[i+1].val === 'X') { squareTotal++;}
        }
        // check for vals on left side
        if ((i - 1) % 8 === 0) {
            squareTotal = 0;
            if (i === 1) {
                // check +1, +8, +9
                if (state.board[i+1].val === 'X') { squareTotal++;}
                if (state.board[i+8].val === 'X') { squareTotal++;}
                if (state.board[i+9].val === 'X') { squareTotal++;}
            } else if (i === 57) {
                // check +1, -8, -7
                if (state.board[i+1].val === 'X') { squareTotal++;}
                if (state.board[i-8].val === 'X') { squareTotal++;}
                if (state.board[i-7].val === 'X') { squareTotal++;}
            } else {
                // check -8, +8, -7, +9, +1
                if (state.board[i-8].val === 'X') { squareTotal++;}
                if (state.board[i+8].val === 'X') { squareTotal++;}
                if (state.board[i-7].val === 'X') { squareTotal++;}
                if (state.board[i+9].val === 'X') { squareTotal++;}
                if (state.board[i+1].val === 'X') { squareTotal++;}
            }
        }
        // check for vals on right side
        if (i % 8 === 0) {
            squareTotal = 0;
            if (i === 8) {
                // check -1, +7, +8
                if (state.board[i-1].val === 'X') { squareTotal++;}
                if (state.board[i+7].val === 'X') { squareTotal++;}
                if (state.board[i+8].val === 'X') { squareTotal++;}
            } else if (i === 64) {
                // check -1, -8, -9
                if (state.board[i-1].val === 'X') { squareTotal++;}
                if (state.board[i-8].val === 'X') { squareTotal++;}
                if (state.board[i-9].val === 'X') { squareTotal++;}
            } else {
                // check -8, +8, +7, -9, -1
                if (state.board[i-8].val === 'X') { squareTotal++;}
                if (state.board[i+8].val === 'X') { squareTotal++;}
                if (state.board[i+7].val === 'X') { squareTotal++;}
                if (state.board[i-9].val === 'X') { squareTotal++;}
                if (state.board[i-1].val === 'X') { squareTotal++;}
            }
        }
        if (state.board[i].val !== 'X') {
            state.board[i].val = squareTotal;
        }
     }
 }
 
 /**
  * Emits a game state to all players in a lobby
  * @param String The room code to send the state to 
  * @param Object The current game state for the minesweeper game 
  * @param Object A Socket.IO instance
  */
 function emitGameState(roomName, state, io) {
     io.in(roomName).emit('minesweeper-game-state', state);
 }
 
 /**
  * Emits a game over state to all players in a lobby
  * @param String The room code to send the state to 
  * @param Object The current game state for the minesweeper game 
  * @param Object A Socket.IO instance
  * @param number The player number of who won
  */
 function emitGameOver(roomName, winner, io) {
     io.in(roomName).emit('minesweeper-game-over', { winner });
 }