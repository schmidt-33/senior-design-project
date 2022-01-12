/**
 * Author: Nick Eby
 * Date: Oct.14.2021
 * File: index.js
 * Description: This file handles all socket and game state events for the pong game
 */

// IDEAS FOR ADVANCED FUNCTIONALITY / FEATURES
    // 1. ALLOW USERS TO SET SCORE BEFORE GAME
    // 2. WAIT A COUPLE SECONDS AFTER EACH SCORE
    // 3. BACKGROUND IMAGE INSTEAD OF A BLACK SCREEN?

    'use strict';
    module.exports = {
        pongSocketEventHandler,
    };
    
    //? Global utilities
    const { makeId } = require('../utils');
    
    //? Game constants
    const {
        BALL_SIZE,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        PADDLE_SPEED,
        FRAME_SPEED,
        GOAL_LIMIT,
    } = require('./constants');
    
    //? Game utils
    const {
        //initPong,
    } = require('./util');
    const { ɵCREATE_ATTRIBUTE_DECORATOR__POST_R3__ } = require('@angular/core');
    
    //? State Mechanisms
    let pongState = {};
    let pongClientRooms = {};

    let counter = 0; // used to eliminate issue with paddle collision
    
    /** 
     * This function listens to and handles all socket events for the game pong
     * @param socket A Socket.IO socket object 
     * @param io A Socket.IO instance 
     */
    function pongSocketEventHandler(socket, io) {
        //?=== Socket Listeners ===//
        socket.on('pong-new-game', handleNewGamePong);
        socket.on('pong-join-game', handleJoinGamePong);
        socket.on('pong-rematch', handleRematchPong);
        socket.on('pong-key-down', handleKeyDown);
        
        //?=== Socket Handlers ===//
        function handleNewGamePong() {
            //? create a new room ID
            const roomName = makeId(5);
    
            //? Track what room the user is in
            pongClientRooms[socket.id] = roomName;
    
            //? Send room code to the user
            socket.emit('pong-game-code', { gameCode: roomName });
    
            //? Initialize game state
            pongState[roomName] = createGameState();
    
            //? Add socket to the room
            socket.join(roomName);
            //? Assign them a player number
            socket.number = 1;
            //? Send the player their number
            socket.emit('pong-init', { playerNumber: 1 });
        }
    
        function handleJoinGamePong(userData) {
            //? If there is no game code present, send an unknown code request
            if (!userData || !userData.gameCode) {
                socket.emit(`pong-unknown-game`, 'Unknown Game');
            }
    
            //? Look for the room that the user is requesting
            const room = io.sockets.adapter.rooms.get(userData.gameCode);
    
            //? If there is no room or the room is empty, send an unknown code response
            if (!room || room.size === 0 || !pongState[userData.gameCode]) {
                socket.emit(`pong-unknown-game`, 'Unknown Game');
                return;
            }
            else if (room.size > 1) {
                //? Room is already full since two player game
                socket.emit(`pong-too-many-players`, `Too many players`);
                return;
            }
    
            //? Track which room user is joining
            pongClientRooms[socket.id] = userData.gameCode;
            //? Join the room
            socket.join(userData.gameCode);
            //? Assign them player 2
            socket.number = 2;
            //? Emit the initialization of a new player
            socket.emit(`pong-init`, { playerNumber: 2 });
            
            // start game since other player has joined
            gameInterval(userData.gameCode, io);
        }
    
        function handleRematchPong(userData) {
            //? Ensure user data was passed
            if (!userData || !userData.gameCode) return;
    
            const { gameCode } = userData;
    
            //? Determine if a new game state has been created for a rematch
            if (pongState[gameCode] && pongState[gameCode].rematchVotes) {
                //? If one user has already voted to a rematch
                if (!pongState[gameCode].rematchVotes.includes(socket.id)) {
                    io.in(gameCode).emit(`pong-rematch-count`, { rematchCount: pongState[gameCode].rematchVotes.length });
                    pongState[gameCode].rematchVotes.push(socket.id);
                }
    
                //? If the second user has accepted, begin the game
                if (pongState[gameCode].rematchVotes.length === 2) {
                    io.in(gameCode).emit(`pong-rematch-count`, { rematchCount: pongState[gameCode].rematchVotes.length });
                    pongState[gameCode] = createGameState(); // reset game state for rematch
                    // start game since both players ready
                    gameInterval(userData.gameCode, io);
                }
            }
            else {
                //? Initialize a new state
                pongState[gameCode] = createGameState();
                pongState[gameCode].rematchVotes = [socket.id];
                io.in(gameCode).emit('pong-rematch-count', { rematchCount: pongState[gameCode].rematchVotes.length });
            }
        }
    
        function handleKeyDown(keyCode) {
            keyCode = keyCode['keyCode'];
            console.log("Called");
            
            //? Get the room name of the current user
            const roomName = pongClientRooms[socket.id];
    
            //? If the room name was not found for the user, Ignore the request
            if (!roomName || pongState[roomName] === null) return;
    
            //? Get the key pressed on the keyboard by integer
            try {
                keyCode = parseInt(keyCode);
    
                //? Ensure the keycode is valid key code before continuing
                if (keyCode < 0) throw new Error("Invalid Keycode Found");
    
                //? Update the user's velocity
                const vel = getPaddleDirection(keyCode);
                if (vel === -1) {
                    // move player position up
                    pongState[roomName].players[socket.number].y -= PADDLE_SPEED;
                    console.log("UP: paddle y: " + pongState[roomName].players[socket.number].y);
                    // check that player not moving off of screen (top)
                    if (pongState[roomName].players[socket.number].y < 0) {
                        pongState[roomName].players[socket.number].y = 0;
                    }
                } else if (vel === 1) {
                    // move player position down
                    pongState[roomName].players[socket.number].y += PADDLE_SPEED;
                    console.log("DOWN: paddle y: " + pongState[roomName].players[socket.number].y);
                    // check that player not moving off of screen (bottom)
                    if (pongState[roomName].players[socket.number].y > pongState[roomName].screenHeight - PADDLE_HEIGHT) {
                        pongState[roomName].players[socket.number].y = pongState[roomName].screenHeight - PADDLE_HEIGHT;
                    }
                } else {
                    // Keycode other than up/down/w/s was pressed
                    console.error("Invalid Keycode pressed... Keycode pressed was " + vel);                   
                } 
            }
            catch (e) {
                console.error(e);
                return;
            }
        }
        
    }
    
    // game function that starts game and follows game logic of pong
    function gameInterval(roomName, io) {
        const intervalId = setInterval(() => {

            // check if ball hits wall
            if ((pongState[roomName].ball.y > pongState[roomName].screenHeight) || (pongState[roomName].ball.y < 0)) {
                pongState[roomName].ball.speedY *= -1;
            }

            if (counter == 0) {
                // check if ball hits LEFT paddle                
                if (((pongState[roomName].ball.x < 10 + PADDLE_WIDTH + BALL_SIZE / 2) && (pongState[roomName].ball.x > 10 + PADDLE_WIDTH - BALL_SIZE / 2) && (pongState[roomName].ball.y > pongState[roomName].players[1].y) && (pongState[roomName].ball.y < pongState[roomName].players[1].y + PADDLE_HEIGHT))) { //|| ((pongState[roomName].ball.x < 10 + PADDLE_WIDTH) && (pongState[roomName].ball.x > 10 + PADDLE_WIDTH - BALL_SIZE / 2) && (pongState[roomName].ball.y < pongState[roomName].players[1].y + PADDLE_HEIGHT - 10) && (pongState[roomName].ball.y > pongState[roomName].players[1].y + 10))) {
                    pongState[roomName].ball.speedX *= -1;
                    pongState[roomName].ball.speedX += 0.25; // increase ball speedX
                    counter = 4;
                }
                // check if ball hits RIGHT paddle                
                if (((pongState[roomName].ball.x < pongState[roomName].screenWidth - 10 - PADDLE_WIDTH + BALL_SIZE / 2) && (pongState[roomName].ball.x > pongState[roomName].screenWidth - (10 + PADDLE_WIDTH + BALL_SIZE / 2)) && (pongState[roomName].ball.y > pongState[roomName].players[2].y) && (pongState[roomName].ball.y < pongState[roomName].players[2].y + PADDLE_HEIGHT))) { //|| ((pongState[roomName].ball.x > pongState[roomName].screenWidth - 10 - PADDLE_WIDTH) && (pongState[roomName].ball.x < pongState[roomName].screenWidth - 10 - PADDLE_WIDTH + BALL_SIZE / 2) && (pongState[roomName].ball.y > pongState[roomName].players[2].y + 10) && (pongState[roomName].ball.y < pongState[roomName].players[2].y + PADDLE_HEIGHT - 10))) {

                    pongState[roomName].ball.speedX *= -1;
                    pongState[roomName].ball.speedX -= 0.25; // increase ball speedX
                    counter = 4;
                }
            } else {
                // counter not equal to zero - decrease for 4 frames - above paddle check does not evaluate
                counter--;
            }

            // check for goal
            if (pongState[roomName].ball.x > pongState[roomName].screenWidth + 10) { // scores on right (P2)
                // update score
                pongState[roomName].players[1].score++;
                // reset ball
                resetBall(pongState[roomName]);
                randomizeBall(pongState[roomName]);
            } else if (pongState[roomName].ball.x < -10) { // scores on left (P1)
                // update score
                pongState[roomName].players[2].score++;
                // reset ball
                resetBall(pongState[roomName]);
                randomizeBall(pongState[roomName]);
            }

            // update ball position
            pongState[roomName].ball.x += pongState[roomName].ball.speedX;
            pongState[roomName].ball.y += pongState[roomName].ball.speedY;

            // check game over
            if (pongState[roomName].players[1].score == GOAL_LIMIT) {
                emitGameState(roomName, pongState[roomName], io);
                emitGameOver(roomName, 1, io);
                delete pongState[roomName];
                clearInterval(intervalId);
            } else if (pongState[roomName].players[2].score == GOAL_LIMIT) {
                emitGameState(roomName, pongState[roomName], io);
                emitGameOver(roomName, 2, io);
                delete pongState[roomName];
                clearInterval(intervalId);
            } else {
                // emit game state
                emitGameState(roomName, pongState[roomName], io); // emits game state every so often based on frame_speed constant
            }
    
        }, FRAME_SPEED);
    }
    
    
    function createGameState() {
        return {
            players: {
                1: {
                    y: 10,
                    score: 0,
                },
                2: {
                    y: 440,
                    score: 0,
                },
            },
            ball: {
                x: 400,
                y: 275,
                speedX: 8,
                speedY: 8,
            },
            screenWidth: 800,
            screenHeight: 550,
        }
    }
    
    
    /**
     * Returns an object indicating a change in velocity for the snake
     * @param keyCode The integer key code pressed on the keyboard 
     */
    function getPaddleDirection(keyCode) {
        switch (keyCode) {
            case 38:
            case 87: {
                //? Left arrow key pressed (or w)
                return -1;
            }
            case 40:
            case 83: {
                //? Right arrow key pressed (or s)
                return 1;
            }
            default:
                return keyCode;
        }
    }

    /**
     * Resets ball attributes in pongState to 0
     * @param state The game state
     */
    function resetBall(state) {
        state.ball.x = 400;
        state.ball.y = 275;
        state.ball.speedX = 0;
        state.ball.speedY = 0;
    }


    /**
     * Randomize ball attributes speedX and speedY
     * NOTE: ball always starts in +8, +8 direction at beginning of game which i think is fine since P2 battle is near there to hit it initially, ball is randomized after each score
     * @param state The game state
     */
     function randomizeBall(state) {
        let randDirection = Math.random() < 0.5; // randomize a boolean
        let randNumX = Math.random(); // random number for speedX
        let randNumY = Math.random(); // random number for speedY
        if (randDirection) { // positive
            state.ball.speedX = Math.floor(randNumX * 6) + 5;
            state.ball.speedY = Math.floor(randNumY * 6) + 5;
        } else { // negative
            state.ball.speedX = Math.floor(randNumX * 6) + 5;
            state.ball.speedY = Math.floor(randNumY * 6) + 5;
            state.ball.speedX *= -1;
            state.ball.speedY *= -1;
        }
    }
    
    /**
     * Emits a game state to all players in a lobby
     * @param String The room code to send the state to 
     * @param Object The current game state for the pong game 
     * @param Object A Socket.IO instance
     */
    function emitGameState(roomName, state, io) {
        io.in(roomName).emit('pong-game-state', state);
    }
    
    /**
     * Emits a game over state to all players in a lobby
     * @param String The room code to send the state to 
     * @param Object The current game state for the pong game 
     * @param Object A Socket.IO instance
     * @param number The player number of who won
     */
    function emitGameOver(roomName, winner, io) {
        io.in(roomName).emit('pong-game-over', { winner });
    }
    