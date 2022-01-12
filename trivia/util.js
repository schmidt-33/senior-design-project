/**
 * Author: Jakob Taylor
 * Date: Jun.22.2021
 * File: util.js
 * Description: This file holds utility functions for the trivia game
 */
'use strict';
module.exports = {
	triviaInitState,
	triviaJoinGame,
	triviaReadyUp,
	triviaAnswerQuestion
}

//? Game Constants
const { TRIVIA_EASY_CORRECT_POINTS } = require('./constants')

/**
 * Returns an initialized game state for trivia
 * @param username The username the user has typed in when initializing the game
 * @param socketId The id given to the connected user's socket
 */
function triviaInitState(username, socketId, numPlayers) {
	return createGameState(username, socketId, numPlayers);
}

/**
 * Returns the initial trivia game state object
 * @param username The username the user has typed in when initializing the game
 * @param socketId The id given to the connected user's socket
 */
function createGameState(username, socketId, numPlayers) {
	return {
		numPlayers,
		players: [
			{
				username,
				socketId,
				ready: false,
				score: 0,
				answers: []
			}
		],
		questions: []
	}
}

/**
 * 
 * @param username The username of the user being added 
 * @param socketId The Id of the user's socket that is joining the game
 * @param state The current state of trivia
 * @returns 
 */
function triviaJoinGame(username, socketId, state) {
	if (!state.players) return;

	//? Add the player to the state
	state.players.push({
		username,
		socketId,
		ready: false,
		score: 0,
		answers: []
	});
	return state;
}

/**
 * Updates the 'ready' state for the specified user
 * @param socketId The Id of the user's socket that is readying up
 * @param state The current state of trivia
 */
function triviaReadyUp(socketId, state) {
	if (!state.players) return;

	for (let i = 0; i < state.players.length; i++) {
		if (state.players[i].socketId === socketId) {
			state.players[i].ready = true;
			return;
		}
	}
}

/**
 * 
 * @param socketId The Id of the user's socket that is readying up
 * @param state The current state of trivia
 * @param isCorrect boolean indicating if the user answered the question correctly
 * @returns 
 */
function triviaAnswerQuestion(socketId, state, isCorrect) {
	console.log(`getting player states`);
	if (!state.players) return;

	for (let i = 0; i < state.players.length; i++) {
		if (state.players[i].socketId === socketId) {
			console.log(`User found in trivia state`)
			if (isCorrect) {
				state.players[i].score += TRIVIA_EASY_CORRECT_POINTS;
			}
			state.players[i].ready = true;
			console.log(state.players[i]);
			return;
		}
	}
}