/**
 * Author: Nick Eby
 * Date: Sep.8.2021
 * File: index.js
 * Description: This file handles all socket and game state events for the space invaders game
 */

 // ADDITIONAL FEATURE IDEAS
	// Blocks that have limited HP that slowly erode as the HP goes down, some space invaders games have this
	// Hero explosion animation when hero gets hit
	// Pause between waves instead of instantaneously starting next wave

'use strict';
module.exports = {
	spaceinvadersSocketEventHandler,
};

//? Global utilities
const { makeId } = require('../utils');

//? Game constants
const {
	HERO_MOVEMENT,
	MISSILE_SPEED,
	FRAME_SPEED,
	ALIEN_SPEED,
} = require('./constants');

//? Game utils
const {
    //initSpaceinvaders,
} = require('./util');
const { ɵCREATE_ATTRIBUTE_DECORATOR__POST_R3__ } = require('@angular/core');
const { clear } = require('console');

//? State Mechanisms
let spaceinvadersState = {};
let spaceinvadersClientRooms = {};

let isGameOver = false;

/** 
 * This function listens to and handles all socket events for the game spaceinvaders
 * @param socket A Socket.IO socket object 
 * @param io A Socket.IO instance 
 */
function spaceinvadersSocketEventHandler(socket, io) {
    //?=== Socket Listeners ===//
    socket.on('spaceinvaders-new-game', handleNewGameSpaceinvaders);
    socket.on('spaceinvaders-join-game', handleJoinGameSpaceinvaders);
    socket.on('spaceinvaders-rematch', handleRematchSpaceinvaders);
	socket.on('spaceinvaders-key-down', handleKeyDown);
	socket.on('spaceinvaders-eliminate-alien', handleEliminateAlien);
	socket.on('spaceinvaders-fire-alien-missile', handleFireAlienMissile);
	socket.on('spaceinvaders-aliens-win', handleAliensWin);
    
    //?=== Socket Handlers ===//
    function handleNewGameSpaceinvaders() {
        //? create a new room ID
        const roomName = makeId(5);

        //? Track what room the user is in
        spaceinvadersClientRooms[socket.id] = roomName;

        //? Send room code to the user
        socket.emit('spaceinvaders-game-code', {gameCode: roomName});

        //? Initialize game state
        spaceinvadersState[roomName] = createGameState();

		//? Add socket to the room
        socket.join(roomName);
		//? Assign them a player number
        socket.number = 1;
		//? Send the player their number
        socket.emit('spaceinvaders-init', { playerNumber: 1 });
        
    }

    function handleJoinGameSpaceinvaders(userData) {
        //? If there is no game code present, send an unknown code request
		if (!userData || !userData.gameCode) {
			socket.emit(`spaceinvaders-unknown-game`, 'Unknown Game');
        }

		//? Look for the room that the user is requesting
        const room = io.sockets.adapter.rooms.get(userData.gameCode);

		//? If there is no room or the room is empty, send an unknown code response
		if (!room || room.size === 0 || !spaceinvadersState[userData.gameCode]) {
			socket.emit(`spaceinvaders-unknown-game`, 'Unknown Game');
			return;
		}
		else if (room.size > 1) {
			//? Room is already full since two player game
			socket.emit(`spaceinvaders-too-many-players`, `Too many players`);
			return;
		}

		//? Track which room user is joining
        spaceinvadersClientRooms[socket.id] = userData.gameCode;
		//? Join the room
		socket.join(userData.gameCode);
		//? Assign them player 2
		socket.number = 2;
		//? Emit the initialization of a new player
		socket.emit(`spaceinvaders-init`, { playerNumber: 2 });
		
		// start game since other player has joined
		isGameOver = false;
		gameInterval(userData.gameCode, io);
    }

    function handleRematchSpaceinvaders(userData) {
        //? Ensure user data was passed
		if (!userData || !userData.gameCode) return;

		const { gameCode } = userData;

		//? Determine if a new game state has been created for a rematch
		if (spaceinvadersState[gameCode] && spaceinvadersState[gameCode].rematchVotes) {
			//? If one user has already voted to a rematch
			if (!spaceinvadersState[gameCode].rematchVotes.includes(socket.id)) {
				io.in(gameCode).emit(`spaceinvaders-rematch-count`, { rematchCount: spaceinvadersState[gameCode].rematchVotes.length });
				spaceinvadersState[gameCode].rematchVotes.push(socket.id);
			}

			//? If the second user has accepted, begin the game
			if (spaceinvadersState[gameCode].rematchVotes.length === 2) {
                io.in(gameCode).emit(`spaceinvaders-rematch-count`, { rematchCount: spaceinvadersState[gameCode].rematchVotes.length });
                spaceinvadersState[gameCode] = createGameState(); // reset game state for rematch
				isGameOver = false;
				gameInterval(userData.gameCode, io);
			}
		}
		else {
			//? Initialize a new state
			spaceinvadersState[gameCode] = createGameState();
			spaceinvadersState[gameCode].rematchVotes = [socket.id];
			io.in(gameCode).emit('spaceinvaders-rematch-count', { rematchCount: spaceinvadersState[gameCode].rematchVotes.length });
		}
    }

    function handleKeyDown(keyCode) {
		keyCode = keyCode['keyCode'];
		
		//? Get the room name of the current user
		const roomName = spaceinvadersClientRooms[socket.id];

		//? If the room name was not found for the user, Ignore the request
		if (!roomName || spaceinvadersState[roomName] === null) return;


		//? Get the key pressed on the keyboard by integer
		try {
			keyCode = parseInt(keyCode);

			//? Ensure the keycode is valid key code before continuing
			if (keyCode < 0) throw new Error("Invalid Keycode Found");



			//? Update the user's velocity
			const vel = getUpdatedVelocity(keyCode);
			if (vel === 10) {
				// if spacebar pressed and missile has been reset, shoot another missile
				spaceinvadersState[roomName].heros[socket.number - 1].missile.x = spaceinvadersState[roomName].heros[socket.number - 1].pos.x;
				spaceinvadersState[roomName].heros[socket.number - 1].missile.y = spaceinvadersState[roomName].heros[socket.number - 1].pos.y;
				// subtract 1 from teamScore for each missile shot
				spaceinvadersState[roomName].teamScore -= 1;
			} else {
				if (spaceinvadersState[roomName].heros[socket.number - 1].pos.x - HERO_MOVEMENT < 0 && vel === -1) {
					// set hero left edge so hero does not go off screen
					spaceinvadersState[roomName].heros[socket.number - 1].pos.x = 0;
				} else if (spaceinvadersState[roomName].heros[socket.number - 1].pos.x + HERO_MOVEMENT > 685 && vel === 1) { // 700 for width of canvas screen
					// set hero right edge so hero does not go off screen
					spaceinvadersState[roomName].heros[socket.number - 1].pos.x = 670;
				} else {
					// move hero based on velocity
					spaceinvadersState[roomName].heros[socket.number - 1].pos.x += vel * HERO_MOVEMENT;
				}
			}
		}
		catch (e) {
			console.error(e);
			return;
		}
	}

	function handleEliminateAlien(data) {
		const roomName = spaceinvadersClientRooms[socket.id];

		//? If the room name was not found for the user, Ignore the request
		if (!roomName || spaceinvadersState[roomName] === null) return;
		
		// set alien to dead
		spaceinvadersState[roomName].aliens[data.row][data.col] = 'D';

		// update missile position to get it off the screen
		spaceinvadersState[roomName].heros[data.pNum].missile.y = 0;
		spaceinvadersState[roomName].heros[data.pNum].missile.x = -50;

		// increase team score
		spaceinvadersState[roomName].teamScore += 10;

	}

	function handleFireAlienMissile(data) {
		const roomName = spaceinvadersClientRooms[socket.id];

		//? If the room name was not found for the user, Ignore the request
		if (!roomName || spaceinvadersState[roomName] === null) return;

		if (spaceinvadersState[roomName].alienMissiles[1].y === 0) {
			spaceinvadersState[roomName].alienMissiles[1].x = data.missileX;
			spaceinvadersState[roomName].alienMissiles[1].y = data.missileY;
		} else if (spaceinvadersState[roomName].alienMissiles[2].y === 0) {
			spaceinvadersState[roomName].alienMissiles[2].x = data.missileX;
			spaceinvadersState[roomName].alienMissiles[2].y = data.missileY;
		} else if (spaceinvadersState[roomName].alienMissiles[3].y === 0) {
			spaceinvadersState[roomName].alienMissiles[3].x = data.missileX;
			spaceinvadersState[roomName].alienMissiles[3].y = data.missileY;
		} else if (spaceinvadersState[roomName].alienMissiles[4].y === 0) {
			spaceinvadersState[roomName].alienMissiles[4].x = data.missileX;
			spaceinvadersState[roomName].alienMissiles[4].y = data.missileY;
		} else if (spaceinvadersState[roomName].alienMissiles[5].y === 0) {
			spaceinvadersState[roomName].alienMissiles[5].x = data.missileX;
			spaceinvadersState[roomName].alienMissiles[5].y = data.missileY;
		}

	}

	function handleAliensWin(data) {
		const roomName = spaceinvadersClientRooms[socket.id];
		if (!roomName || spaceinvadersState[roomName] === null) return;

		// set heros alive to false so next iteration of gameInterval will clear interval and delete state
		spaceinvadersState[roomName].heros[0].alive = false;
		spaceinvadersState[roomName].heros[1].alive = false;
	}
	
}

function gameInterval(roomName, io) {
	const intervalId = setInterval(() => {
		if (isGameOver) {
			clearInterval(intervalId);
		} else {


		
		// update missile for each hero
		for (let i = 0; i < 2; i++) {
			if (spaceinvadersState[roomName].heros[i].missile.y !== 0) {
				spaceinvadersState[roomName].heros[i].missile.y -= MISSILE_SPEED;
			}
		}
		// update alien missiles
		for (let i = 1; i < 6; i++) {
			if (spaceinvadersState[roomName].alienMissiles[i].y != 0) {
				spaceinvadersState[roomName].alienMissiles[i].y += ALIEN_SPEED;
			}
			// reset missiles if they end up unscathed and off bottom of screen
			if (spaceinvadersState[roomName].alienMissiles[i].y > 800) { // spaceinvadersState[roomName].heros[1].pos.y + spaceinvadersState[roomName].heroSize * 2 // had it as less than this but issues with resetting missiles // temporary fix
				spaceinvadersState[roomName].alienMissiles[i].y = 0;
				spaceinvadersState[roomName].alienMissiles[i].x = -50;
			}
			// check for hero and alien missile collision : if collision, reset both
			for (let j = 0; j < 2; j++) {
				if (spaceinvadersState[roomName].alienMissiles[i].x >= spaceinvadersState[roomName].heros[j].missile.x && (spaceinvadersState[roomName].alienMissiles[i].x <= spaceinvadersState[roomName].heros[j].missile.x + 10) && (spaceinvadersState[roomName].alienMissiles[i].y >= spaceinvadersState[roomName].heros[j].missile.y - 30)) {
					spaceinvadersState[roomName].alienMissiles[i].x = -50;
					spaceinvadersState[roomName].alienMissiles[i].y = 0;
					spaceinvadersState[roomName].heros[j].missile.x = -50;
					spaceinvadersState[roomName].heros[j].missile.y = 0;
				}
			}
			
		}


		// check if alien missile hits hero
		for (let i = 1; i < 6; i++) {
			// remember for checking if it hits hero, the coordinates are top left
			if (spaceinvadersState[roomName].alienMissiles[i].x >= spaceinvadersState[roomName].heros[0].pos.x - spaceinvadersState[roomName].heroSize / 2 && spaceinvadersState[roomName].alienMissiles[i].x <= spaceinvadersState[roomName].heros[0].pos.x + spaceinvadersState[roomName].heroSize / 2 && spaceinvadersState[roomName].alienMissiles[i].y >= spaceinvadersState[roomName].heros[0].pos.y && spaceinvadersState[roomName].alienMissiles[i].y <= spaceinvadersState[roomName].heros[0].pos.y + spaceinvadersState[roomName].heroSize) {
				// eliminate hero 1
				spaceinvadersState[roomName].heros[0].alive = false;
				// subtract points for hero destruction
				spaceinvadersState[roomName].teamScore -= 25;
				// reset missile
				spaceinvadersState[roomName].alienMissiles[i].x = -50;
				spaceinvadersState[roomName].alienMissiles[i].y = 0;
				// move hero off screen so it doesnt affect missiles
				spaceinvadersState[roomName].heros[0].pos.x = 1000;
				spaceinvadersState[roomName].heros[0].pos.y = 3000;
			}
			if (spaceinvadersState[roomName].alienMissiles[i].x >= spaceinvadersState[roomName].heros[1].pos.x - spaceinvadersState[roomName].heroSize / 2 && spaceinvadersState[roomName].alienMissiles[i].x <= spaceinvadersState[roomName].heros[1].pos.x + spaceinvadersState[roomName].heroSize / 2 && spaceinvadersState[roomName].alienMissiles[i].y >= spaceinvadersState[roomName].heros[1].pos.y && spaceinvadersState[roomName].alienMissiles[i].y <= spaceinvadersState[roomName].heros[1].pos.y + spaceinvadersState[roomName].heroSize) {
				// eliminate hero 2
				spaceinvadersState[roomName].heros[1].alive = false;
				// subtract points for hero destruction
				spaceinvadersState[roomName].teamScore -= 25;
				// reset missile
				spaceinvadersState[roomName].alienMissiles[i].x = -50;
				spaceinvadersState[roomName].alienMissiles[i].y = 0;
				// move hero off screen so it doesnt affect missiles
				spaceinvadersState[roomName].heros[1].pos.x = 1000;
				spaceinvadersState[roomName].heros[1].pos.y = 3000;
			}
		}

		// check if wave over
		let counter = 0;
		for (let i = 1; i < 6; i++) {
			for (let j = 0; j < 10; j++) {
				if (spaceinvadersState[roomName].aliens[i][j] === 'D') {
					counter++;
				} else {
					counter = 0;
					break;
				}
			}
		}
		if (counter === 50) {
			// all aliens eliminated so wave is over
			counter = 0;
			// add points to team score for completing wave
			spaceinvadersState[roomName].teamScore += 100;
			// if player 1 eliminated then reset player 1, else if player 2 eliminated then reset player 2
			if (spaceinvadersState[roomName].heros[0].alive === false) {
				spaceinvadersState[roomName].heros[0].alive = true;
				spaceinvadersState[roomName].heros[0].pos.x = 332;
				spaceinvadersState[roomName].heros[0].pos.y = 465;
			} else if (spaceinvadersState[roomName].heros[1].alive === false) {
				spaceinvadersState[roomName].heros[1].alive = true;
				spaceinvadersState[roomName].heros[1].pos.x = 332;
				spaceinvadersState[roomName].heros[1].pos.y = 430;
			}
			// reset type of aliens
			for (let i = 1; i < 6; i++) {
				let type; // declared here so type can be read later
				if (Math.random() < 0.5) {
					type = 'S';
				} else {
					type = 'R';
				}
				for (let j = 0; j < 10; j++) {
					spaceinvadersState[roomName].aliens[i][j] = type;
				}
			}			
			//emitNewWave(roomName, 0, io);
			emitGameOver(roomName, 1, io); // ISSUES CALLING EMITNEWWAVE SO I CALLED EMITGAMEOVER USING A DIFFERNT CODE (ie 1)
			// make sure alien missiles are reset
			for (let i = 1; i < 6; i++) {
				spaceinvadersState[roomName].alienMissiles[i].y = 0;
			}
			
		}
		

		// check game over
		if (spaceinvadersState[roomName].heros[0].alive === false && spaceinvadersState[roomName].heros[1].alive === false) {
			emitGameState(roomName, spaceinvadersState[roomName], io);
			emitGameOver(roomName, 0, io);
			isGameOver = true;
			delete spaceinvadersState[roomName];
			clearInterval(intervalId);
		} else {
			// emit game state
			emitGameState(roomName, spaceinvadersState[roomName], io); // emits game state every so often based on frame_speed constant
		}


	}

	}, FRAME_SPEED);
}


function createGameState() {
	return {
		heroSize: 40,
		alienSize: 25,
		teamScore: 0,
		heros: [
			{ // hero 1 / player 1
				pos: {
					x: 332,
					y: 465,
				},
				alive: true,
				missile: {
					x: -50, // keeps missile off screen when it is reset
					y: 0,
				},
			},
			{ // hero 2 / player 2
				pos: {
					x: 332,
					y: 430,
				},
				alive: true,
				missile: {
					x: -50, // keeps missile off screen when it is reset
					y: 0,
				},
			},
		],
		aliens: { 
			// alien type in each array // 'D' for dead // 'R' means Regular alien // 'S' means Super alien
			'1': ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
			'2': ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
			'3': ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
			'4': ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
			'5': ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
		},
		alienMissiles: {
			'1': {'x': -50, 'y': 0},
			'2': {'x': -50, 'y': 0},
			'3': {'x': -50, 'y': 0},
			'4': {'x': -50, 'y': 0},
			'5': {'x': -50, 'y': 0},
		}
	}
}


/**
 * Returns an object indicating a change in velocity for the snake
 * @param keyCode The integer key code pressed on the keyboard 
 */
function getUpdatedVelocity(keyCode) {
	switch (keyCode) {
		case 37: {
			//? Left arrow key pressed
			return -1;
		}
		case 39: {
			//? Right arrow key pressed
			return 1;
		}
		case 32: {
			//? Space bar pressed
			return 10;
		}
		default:
			return 0;
	}
}

/**
 * Emits a game state to all players in a lobby
 * @param String The room code to send the state to 
 * @param Object The current game state for the spaceinvaders game 
 * @param Object A Socket.IO instance
 */
function emitGameState(roomName, state, io) {
    io.in(roomName).emit('spaceinvaders-game-state', state);
}

/**
 * Emits a game over state to all players in a lobby
 * @param String The room code to send the state to 
 * @param Object The current game state for the spaceinvaders game 
 * @param Object A Socket.IO instance
 * @param number The player number of who won
 */
function emitGameOver(roomName, winner, io) {
	io.in(roomName).emit('spaceinvaders-game-over', { winner });
}

// ISSUES CALLING THIS FUNCTION SO I USED EMITGAMEOVER
/**
 * Emits a new wave state
 */
// function emitNewWave(roomName, num, io) {
// 	io.in(roomName).emit('spaceinvaders-new-wave', {num});
// }
