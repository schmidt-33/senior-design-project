/**
 * Author: Jakob Taylor
 * Date: Jun.18.2021
 * File: util.js
 * Description: This file holds utility functions for the snake game
 */
'use strict';
module.exports = {
	gameLoop,
	getUpdatedVelocity,
	initGame
}

//? Game Constants
const { GRID_SIZE } = require('./constants')

/**
 * Returns an object indicating a change in velocity for the snake
 * @param keyCode The integer key code pressed on the keyboard 
 */
function getUpdatedVelocity(keyCode) {
	switch (keyCode) {
		case 37: {
			//? Left arrow key pressed
			return { x: -1, y: 0 };
		}
		case 38: {
			//? Down arrow key pressed
			return { x: 0, y: -1 };
		}
		case 39: {
			//? Right arrow key pressed
			return { x: 1, y: 0 };
		}
		case 40: {
			//? Up arrow key pressed
			return { x: 0, y: 1 };
		}
	}
}

/**
 * Initialize the game state for a new game of snake and place food on the grid
 */
function initGame() {
	//? Initialize the game state for two players
	const state = createGameState();
	//? Place a random food on the map
	randomFood(state);
	//? Return the configured state
	return state;
}

/**
 * Returns an initialized game state for two players
 */
function createGameState() {
	return {
		players: [
			{
				pos: {
					x: 3,
					y: 10
				},
				vel: {
					x: 1,
					y: 0
				},
				snake: [
					{ x: 1, y: 10 },
					{ x: 2, y: 10 },
					{ x: 3, y: 10 },
				]
			},
			{
				pos: {
					x: 16,
					y: 10
				},
				vel: {
					x: -1,
					y: 0
				},
				snake: [
					{ x: 18, y: 10 },
					{ x: 17, y: 10 },
					{ x: 16, y: 10 },
				]
			}
		],
		food: {},
		gridSize: GRID_SIZE
	}
}

/**
 * A recursive function to place a new food on the canvas in a random location and not on a cell a player is currently on
 * @param state A generated game state for a new snake game 
 */
function randomFood(state) {
	//? Generate a random coordinate
	const food = {
		x: Math.floor(Math.random() * GRID_SIZE),
		y: Math.floor(Math.random() * GRID_SIZE),
	}

	//? Loop through all player 1 cells and ensure the food does not overlap
	for (let cell of state.players[0].snake) {
		if (cell.x === food.x && cell.y === food.y) {
			//? Overlap encountered, generate a new food
			return randomFood(state)
		}
	}

	//? Loop through all player 2 cells and ensure the food does not overlap
	for (let cell of state.players[1].snake) {
		if (cell.x === food.x && cell.y === food.y) {
			//? Overlap encountered, generate a new food
			return randomFood(state)
		}
	}

	//? Assign the food to the current game state
	state.food = food;
}

/**
 * Determines if there is a winner or not and updates the game state accordingly in either case 
 * @param Object The current state of a snake game 
 */
function gameLoop(state) {
	//? If not game state was provided, ignore the request
	if (!state) return;

	//? Get each player object
	const playerOne = state.players[0];
	const playerTwo = state.players[1];

	//? Update their X position
	playerOne.pos.x += playerOne.vel.x;
	playerOne.pos.y += playerOne.vel.y;

	//? Update their Y position
	playerTwo.pos.x += playerTwo.vel.x;
	playerTwo.pos.y += playerTwo.vel.y;

	//? Determine if player 1 has hit a wall
	if (playerOne.pos.x < 0 || playerOne.pos.x > GRID_SIZE ||
		playerOne.pos.y < 0 || playerOne.pos.y > GRID_SIZE) {
		//? Player 2 wins
		return 2;
	}

	//? Determine if player 2 has hit a wall
	if (playerTwo.pos.x < 0 || playerTwo.pos.x > GRID_SIZE ||
		playerTwo.pos.y < 0 || playerTwo.pos.y > GRID_SIZE) {
		//? Player 1 wins
		return 1;
	}

	//? Determine if player 1 has eaten food
	if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y) {
		//? Add a new segment on their current position
		playerOne.snake.push({ ...playerOne.pos });
		playerOne.pos.x += playerOne.vel.x;
		playerOne.pos.y += playerOne.vel.y;
		//? Add a new food to the canvas
		randomFood(state);
	}

	//? Determine if player 2 has eaten food
	if (state.food.x === playerTwo.pos.x && state.food.y === playerTwo.pos.y) {
		//? Add a new segment on their current position
		playerTwo.snake.push({ ...playerTwo.pos });
		playerTwo.pos.x += playerTwo.vel.x;
		playerTwo.pos.y += playerTwo.vel.y;
		//? Add a new food to the canvas
		randomFood(state);
	}

	//? Determine if player 1 has ran into themselves
	if (playerOne.vel.x || playerOne.vel.y) {
		for (let cell of playerOne.snake) {
			if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) {
				//? Player 2 wins
				return 2;
			}
		}

		playerOne.snake.push({ ...playerOne.pos });
		playerOne.snake.shift();
	}

	//? Determine if player 2 has ran into themselves
	if (playerTwo.vel.x || playerTwo.vel.y) {
		for (let cell of playerTwo.snake) {
			if (cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y) {
				//? Player 1 wins
				return 1;
			}
		}

		playerTwo.snake.push({ ...playerTwo.pos });
		playerTwo.snake.shift();
	}

	//? Determine if the snakes have collided
	if (playerOne.vel.x || playerOne.vel.y) {
		for (let p1Cell of playerOne.snake) {
			for (let p2Cell of playerTwo.snake) {
				if (p1Cell.x === p2Cell.x && p1Cell.y === p2Cell.y) {
					//? determine who has hit who
					//* head on collision
					if (playerOne.vel.x + playerTwo.vel.x === 0 &&
						playerOne.vel.y + playerTwo.vel.y === 0 &&
						playerOne.pos.x === playerTwo.pos.x &&
						playerOne.pos.y === playerTwo.pos.y) {
						//? Whoever is longer wins. If they are the same player 1 wins
						return playerOne.snake.length >= playerTwo.snake.length
							? 1
							: 2
					}

					//* player two has ran into player one
					if (playerTwo.pos.x === p1Cell.x &&
						playerTwo.pos.y === p1Cell.y) {
						return 1;
					}

					//* player one has ran into player two 
					if (playerOne.pos.x === p2Cell.x &&
						playerOne.pos.y === p2Cell.y) {
						return 2;
					}
				}
			}
		}
	}

	return false;
}