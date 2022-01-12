/**
 * Author: Nick Eby
 * Date: Nov.16.2021
 * File: index.js
 * Description: This file handles all socket and game state events for the space race game
 */

    'use strict';
    module.exports = {
        spaceraceSocketEventHandler,
    };
    
    //? Global utilities
    const { makeId } = require('../utils');
    
    //? Game constants
    const {
        SCORE_LIMIT,
        FRAME_RATE,
        ROCKET_SIZE,
    } = require('./constants');
    
    //? Game utils
    const {
        //initSpacerace,
    } = require('./util');
    const { ɵCREATE_ATTRIBUTE_DECORATOR__POST_R3__ } = require('@angular/core');
    const { clear } = require('console');
    
    //? State Mechanisms
    let spaceraceState = {};
    let spaceraceClientRooms = {};
    
    let isGameOver = false;
    
    /** 
     * This function listens to and handles all socket events for the game spacerace
     * @param socket A Socket.IO socket object 
     * @param io A Socket.IO instance 
     */
    function spaceraceSocketEventHandler(socket, io) {
        //?=== Socket Listeners ===//
        socket.on('spacerace-new-game', handleNewGameSpacerace);
        socket.on('spacerace-join-game', handleJoinGameSpacerace);
        socket.on('spacerace-rematch', handleRematchSpacerace);
        socket.on('spacerace-key-down', handleKeyDown);
        
        //?=== Socket Handlers ===//
        function handleNewGameSpacerace() {
            //? create a new room ID
            const roomName = makeId(5);
    
            //? Track what room the user is in
            spaceraceClientRooms[socket.id] = roomName;
    
            //? Send room code to the user
            socket.emit('spacerace-game-code', {gameCode: roomName});
    
            //? Initialize game state
            spaceraceState[roomName] = createGameState();
    
            //? Add socket to the room
            socket.join(roomName);
            //? Assign them a player number
            socket.number = 1;
            //? Send the player their number
            socket.emit('spacerace-init', { playerNumber: 1 });
            
        }
    
        function handleJoinGameSpacerace(userData) {
            //? If there is no game code present, send an unknown code request
            if (!userData || !userData.gameCode) {
                socket.emit(`spacerace-unknown-game`, 'Unknown Game');
            }
    
            //? Look for the room that the user is requesting
            const room = io.sockets.adapter.rooms.get(userData.gameCode);
    
            //? If there is no room or the room is empty, send an unknown code response
            if (!room || room.size === 0 || !spaceraceState[userData.gameCode]) {
                socket.emit(`spacerace-unknown-game`, 'Unknown Game');
                return;
            }
            else if (room.size > 1) {
                //? Room is already full since two player game
                socket.emit(`spacerace-too-many-players`, `Too many players`);
                return;
            }
    
            //? Track which room user is joining
            spaceraceClientRooms[socket.id] = userData.gameCode;
            //? Join the room
            socket.join(userData.gameCode);
            //? Assign them player 2
            socket.number = 2;
            //? Emit the initialization of a new player
            socket.emit(`spacerace-init`, { playerNumber: 2 });
            
            // start game since other player has joined
            isGameOver = false;
            initialRandomizationX(spaceraceState[userData.gameCode]);
            gameInterval(userData.gameCode, io);
        }
    
        function handleRematchSpacerace(userData) {
            //? Ensure user data was passed
            if (!userData || !userData.gameCode) return;
    
            const { gameCode } = userData;
    
            //? Determine if a new game state has been created for a rematch
            if (spaceraceState[gameCode] && spaceraceState[gameCode].rematchVotes) {
                //? If one user has already voted to a rematch
                if (!spaceraceState[gameCode].rematchVotes.includes(socket.id)) {
                    io.in(gameCode).emit(`spacerace-rematch-count`, { rematchCount: spaceraceState[gameCode].rematchVotes.length });
                    spaceraceState[gameCode].rematchVotes.push(socket.id);
                }
    
                //? If the second user has accepted, begin the game
                if (spaceraceState[gameCode].rematchVotes.length === 2) {
                    io.in(gameCode).emit(`spacerace-rematch-count`, { rematchCount: spaceraceState[gameCode].rematchVotes.length });
                    //spaceraceState[gameCode] = createGameState(); // reset game state for rematch
                    spaceraceState[gameCode].y[1] = 500;
                    spaceraceState[gameCode].y[2] = 500;
                    spaceraceState[gameCode].score[1] = 0;
                    spaceraceState[gameCode].score[2] = 0;
                    isGameOver = false;
                    initialRandomizationX(spaceraceState[gameCode]);
                    gameInterval(userData.gameCode, io);
                }
            }
            else {
                //? Initialize a new state
                spaceraceState[gameCode] = createGameState();
                spaceraceState[gameCode].rematchVotes = [socket.id];
                io.in(gameCode).emit('spacerace-rematch-count', { rematchCount: spaceraceState[gameCode].rematchVotes.length });
            }
        }
    
        function handleKeyDown(keyCode) {
            keyCode = keyCode['keyCode'];
            
            //? Get the room name of the current user
            const roomName = spaceraceClientRooms[socket.id];
    
            //? If the room name was not found for the user, Ignore the request
            if (!roomName || spaceraceState[roomName] === null) return;
    
    
            //? Get the key pressed on the keyboard by integer
            try {
                keyCode = parseInt(keyCode);
    
                //? Ensure the keycode is valid key code before continuing
                if (keyCode < 0) throw new Error("Invalid Keycode Found");
    
    
    
                //? Update the user's velocity
                const vel = getUpdatedVelocity(keyCode);
                if (vel === -1) {
                    // player moves down on screen
                    spaceraceState[roomName].y[socket.number] -= 10;

                } else if (vel === 1) {
                    // player moves up on screen
                    spaceraceState[roomName].y[socket.number] += 10;

                } else {
                    console.log("invalid keypress");
                }
            }
            catch (e) {
                console.error(e);
                return;
            }
        }
        
    }
    
    function gameInterval(roomName, io) {
        const intervalId = setInterval(() => {
            if (isGameOver) {
                clearInterval(intervalId);
            } else {

                // for each player
                for (let i = 1; i <= 2; i++) {
                    // check if rocket scores
                    if (spaceraceState[roomName].y[i] < 20) {
                        // increase score
                        spaceraceState[roomName].score[i]++;
                        // reset rocket
                        spaceraceState[roomName].y[i] = 500;
                    }
                    // check if rocket off bottom of screen
                    if (spaceraceState[roomName].y[i] > spaceraceState[roomName].screen.height) {
                        spaceraceState[roomName].y[i] = spaceraceState[roomName].screen.height;
                    }
                }

                // move asteroids
                for (let i = 1; i <= 18; i++) {
                    spaceraceState[roomName].asteroids[i].x -= 4;
                    if (spaceraceState[roomName].asteroids[i].x < 5) {
                        spaceraceState[roomName].asteroids[i].x = 700;
                        spaceraceState[roomName].asteroids[i].y = Math.floor(Math.random() * (spaceraceState[roomName].screen.height - 100)) + 1;
                    }
                    if (spaceraceState[roomName].asteroids[i].x + 5 > ((spaceraceState[roomName].screen.width / 8) * 3) && spaceraceState[roomName].asteroids[i].x + 5 < ((spaceraceState[roomName].screen.width / 8) * 3) + 25 && (spaceraceState[roomName].asteroids[i].y + 2) < spaceraceState[roomName].y[1] && spaceraceState[roomName].asteroids[i].y + 2 > spaceraceState[roomName].y[1] - 35) {
                        spaceraceState[roomName].y[1] = spaceraceState[roomName].screen.height;
                    }
                    if (spaceraceState[roomName].asteroids[i].x + 5 > ((spaceraceState[roomName].screen.width / 8) * 5 - 25) && spaceraceState[roomName].asteroids[i].x + 5 < (((spaceraceState[roomName].screen.width / 8) * 5)) && (spaceraceState[roomName].asteroids[i].y + 2) < spaceraceState[roomName].y[2] && spaceraceState[roomName].asteroids[i].y + 2 > spaceraceState[roomName].y[2] - 35) {
                        spaceraceState[roomName].y[2] = spaceraceState[roomName].screen.height;
                    }
                }
                for (let i = 19; i <= 36; i++) {
                    spaceraceState[roomName].asteroids[i].x += 4;
                    if (spaceraceState[roomName].asteroids[i].x > spaceraceState[roomName].screen.width - 5) {
                        spaceraceState[roomName].asteroids[i].x = 0;
                        spaceraceState[roomName].asteroids[i].y = Math.floor(Math.random() * (spaceraceState[roomName].screen.height - 100)) + 1;
                    }
                    if (spaceraceState[roomName].asteroids[i].x + 5 > ((spaceraceState[roomName].screen.width / 8) * 3) && spaceraceState[roomName].asteroids[i].x + 5 < ((spaceraceState[roomName].screen.width / 8) * 3) + 25 && spaceraceState[roomName].asteroids[i].y + 2 < spaceraceState[roomName].y[1] && spaceraceState[roomName].asteroids[i].y + 2 > spaceraceState[roomName].y[1] - 35) {
                        spaceraceState[roomName].y[1] = spaceraceState[roomName].screen.height;
                    }
                    if (spaceraceState[roomName].asteroids[i].x + 5 > ((spaceraceState[roomName].screen.width / 8) * 5 - 25) && spaceraceState[roomName].asteroids[i].x + 5 < ((spaceraceState[roomName].screen.width / 8) * 5) && spaceraceState[roomName].asteroids[i].y + 2 < spaceraceState[roomName].y[2] && spaceraceState[roomName].asteroids[i].y + 2 > spaceraceState[roomName].y[2] - 35) {
                        spaceraceState[roomName].y[2] = spaceraceState[roomName].screen.height;
                    }
                }
    
                emitGameState(roomName, spaceraceState[roomName], io); // emits game state every so often based on frame_speed constant

                // for each player
                for (let i = 1; i <= 2; i++) {
                    // check for game score at score limit
                    if (spaceraceState[roomName].score[i] >= SCORE_LIMIT) {
                        // emit game over
                        isGameOver = true;
                        emitGameOver(roomName, i, io);
                        // delete spaceraceState[roomName];
                    }
                }
    
            }
    
        }, 1000 / FRAME_RATE);
    }

    function initialRandomizationX(state) {
        for (let i = 1; i < 36; i++) {
            state.asteroids[i].x = Math.floor(Math.random() * (state.screen.width)) + 1;
        }
    }
    
    
    function createGameState() {
        return {
            score: {
                1: 0,
                2: 0,
            },
            screen: {
                width: 700,
                height: 500,
            },
            y: {
                1: 500,
                2: 500, 
            },
            asteroids: {
                1: {x: 700, y: 10},
                2: {x: 700, y: 20},
                3: {x: 700, y: 30},
                4: {x: 700, y: 40},
                5: {x: 700, y: 50},
                6: {x: 700, y: 60},
                7: {x: 700, y: 70},
                8: {x: 700, y: 80},
                9: {x: 700, y: 90},
                10: {x: 700, y: 100},
                11: {x: 700, y: 110},
                12: {x: 700, y: 120},
                13: {x: 700, y: 130},
                14: {x: 700, y: 140},
                15: {x: 700, y: 150},
                16: {x: 700, y: 160},
                17: {x: 700, y: 170},
                18: {x: 700, y: 180},
                19: {x: 0, y: 190},
                20: {x: 0, y: 200},
                21: {x: 0, y: 210},
                22: {x: 0, y: 220},
                23: {x: 0, y: 230},
                24: {x: 0, y: 240},
                25: {x: 0, y: 250},
                26: {x: 0, y: 260},
                27: {x: 0, y: 270},
                28: {x: 0, y: 280},
                29: {x: 0, y: 290},
                30: {x: 0, y: 300},
                31: {x: 0, y: 310},
                32: {x: 0, y: 320},
                33: {x: 0, y: 330},
                34: {x: 0, y: 340},
                35: {x: 0, y: 350},
                36: {x: 0, y: 360},
            }
        }
    }
    
    
    /**
     * Returns an object indicating a change in velocity for the snake
     * @param keyCode The integer key code pressed on the keyboard 
     */
    function getUpdatedVelocity(keyCode) {
        switch (keyCode) {
            case 38: {
                //? Up arrow key pressed
                return -1;
            }
            case 40: {
                //? Down arrow key pressed
                return 1;
            }
            default:
                return 0;
        }
    }
    
    /**
     * Emits a game state to all players in a lobby
     * @param String The room code to send the state to 
     * @param Object The current game state for the spacerace game 
     * @param Object A Socket.IO instance
     */
    function emitGameState(roomName, state, io) {
        io.in(roomName).emit('spacerace-game-state', state);
    }
    
    /**
     * Emits a game over state to all players in a lobby
     * @param String The room code to send the state to 
     * @param Object The current game state for the spacerace game 
     * @param Object A Socket.IO instance
     * @param number The player number of who won
     */
    function emitGameOver(roomName, winner, io) {
        io.in(roomName).emit('spacerace-game-over', { winner });
    }