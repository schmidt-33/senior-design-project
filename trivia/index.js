/**
 * Author: Jakob Taylor
 * Date: Jun.22.2021
 * File: index.js
 * Description: This file handles all socket and game state events for the trivia game
 */
'use strict';

//? State Mechanisms
let triviaClientRooms = {};
let triviaState = {};

module.exports = {
	triviaSocketEventHandler,
	triviaClientRooms,
	handleTriviaDisconnect
};

//? Global utilities
const { makeId } = require('../utils');

//? Game constants
const {
	MAX_TRIVIA_LOBBY_SIZE
} = require('./constants');

//? Game utils
const {
	triviaInitState,
	triviaJoinGame,
	triviaReadyUp,
	triviaAnswerQuestion
} = require('./util');

/** 
 * This function listens to and handles all socket events for the game snake
 * @param socket A Socket.IO socket object 
 * @param io A Socket.IO instance 
 */
function triviaSocketEventHandler(socket, io) {
	//?=== Socket Listeners ===//
	socket.on('trivia-init-game', handleTriviaInitGame)
	socket.on('trivia-questions', handleTriviaQuestions)
	socket.on('trivia-join-game', handleTriviaJoinGame)
	socket.on('trivia-ready-up', handleTriviaReadyUp)
	socket.on('trivia-answer-question', handleTriviaAnswerQuestion)
	socket.on('trivia-ask-question', handleTriviaNextQuestion)
	// //
	// //
	//?=== Socket Handlers ===//
	function handleTriviaInitGame(data) {
		//? If no username is provided, ignore the request
		if (!data || !data.username || !data.numPlayers) return;

		//? Get the necessary values for initializing a new trivia game
		const username = data.username;
		const numPlayers = data.numPlayers
		const id = socket.id;
		const roomName = makeId(5);

		//? Track what room the user is in 
		triviaClientRooms[id] = roomName;
		//? Track trivia state
		triviaState[roomName] = triviaInitState(username, id, numPlayers);

		//? Add user to room code
		socket.join(roomName);
		//? Assign the user's player number
		socket.number - triviaState[roomName].players.length;
		//? Send state information to user
		socket.emit(
			`trivia-init-game`,
			{
				playerNumber: socket.number,
				state: triviaState[roomName],
				roomName, gameStatus: 'preGame'
			}
		);
	}

	function handleTriviaQuestions(data) {
		//? Ensure the required parameters are given
		if (!data || !data.roomName || !data.questions) return;
		const roomName = data.roomName;
		const questions = data.questions;

		//? Ensure the game state exists
		if (!triviaState[roomName]) return;

		//? Assign the questions to the given state
		triviaState[roomName]['questions'] = questions;
	}

	function handleTriviaJoinGame(data) {
		//? Ensure the required data is given
		console.log(data);
		if (!data || !data['roomCode'] || !data['username']) {
			socket.emit('trivia-unknown-game', { UnknownGame: 'UnknownGame' });
			console.log('Not all data provided');
			return;
		}
		const { roomCode, username } = data;

		//? Get the room the user is requesting to join
		const room = io.sockets.adapter.rooms.get(roomCode);

		//? If the room/state was not found or the room is empty
		if (room === undefined || room.size === 0 || triviaState[roomCode] === null) {
			socket.emit('trivia-unknown-game', { UnknownGame: 'UnknownGame' });
			return;
		}
		else if (room.size >= triviaState[roomCode].numPlayers) {
			//? Lobby is full
			socket.emit('trivia-too-many-players', { TooManyPlayers: 'TooManyPlayers' });
			return;
		}

		//? Track what room the user is in
		triviaClientRooms[socket.id] = roomCode;
		//? Join the room
		socket.join(roomCode);
		//? Add the player to the trivia state
		triviaState[data.roomCode] = triviaJoinGame(username, socket.id, triviaState[roomCode]);
		//? Assign player a number
		socket.number = triviaState[roomCode].players.length;
		//? Send the State to the current player joining
		socket.emit(`trivia-join-game`, triviaState[data.roomCode]);
		//? Send event to all players in the lobby to update the player list
		triviaJoinGameEmit(roomCode, triviaState[roomCode], io);
	}

	function handleTriviaReadyUp(data) {
		//? Ensure the required data is given
		if (!data || !data.roomName) return;
		const { roomName } = data;

		//? Ensure the state being requested exists
		if (!triviaState[roomName]) return;

		//? Update user ready state and send to all lobby members
		triviaReadyUp(socket.id, triviaState[roomName]);
		triviaReadyUpEmit(roomName, triviaState[roomName], io);

		//? If everyone is readied, begin question interval
		if (triviaState[roomName].players.length > 1 &&
			triviaState[roomName].players.length <= triviaState[roomName].numPlayers) {
			//? Determine if all are readied
			for (let i = 0; i < triviaState[roomName].players.length; i++) {
				if (triviaState[roomName].players[i].ready === false) {
					return;
				}
			}

			startQuestionInterval(roomName, 1, io);
		}
	}

	function handleTriviaAnswerQuestion(data) {
		//? Ensure the required data is given
		console.log(data);
		if (!data || !data.roomName && data.isCorrect !== undefined) return;
		const { roomName, isCorrect } = data;

		//? Ensure the trivia state exists
		if (!triviaState[roomName]) return;

		triviaAnswerQuestion(socket.id, triviaState[roomName], isCorrect);
		socket.emit('trivia-answer-question', triviaState[roomName]);
	}

	function handleTriviaNextQuestion(data) {
		//? Ensure the required data is given
		if (!data || !data.roomName || !data.questionNumber) return;
		const { roomName, questionNumber } = data;

		//? Ensure the trivia state exists
		if (!triviaState[roomName]) return;

		startQuestionInterval(roomName, questionNumber, io);
	}
}

/**
 * Emits an event to all players in the trivia with a new player
 * @param roomCode The code to emit the event to 
 * @param state The current trivia state 
 * @param io A Socket.IO instance 
 */
function triviaJoinGameEmit(roomCode, state, io) {
	io.in(roomCode).emit('trivia-join-game-all', state);
}

/**
 * Emits an event to all players in the trivia with a ready up flag
 * @param roomCode The code to emit the event to 
 * @param state The current trivia state 
 * @param io A Socket.IO instance 
 */
function triviaReadyUpEmit(roomCode, state, io) {
	console.log(`Sending ready up to all players`);
	io.in(roomCode).emit('trivia-ready-up-all', state);
}

/**
 * Sends question data and a countdown to players
 * @param roomName The code to emit the event to 
 * @param questionNumber The current question number to begin the interval on
 * @param io A Socket.IO instance
 */
function startQuestionInterval(roomName, questionNumber, io) {
	let secondsRemaining = 31;
	let readyCheckedOnce = false;
	//? Set all user statuses to false
	if (triviaState[roomName]) {
		for (let i = 0; i < triviaState[roomName].players.length; i++) {
			triviaState[roomName].players[i].ready = false;
		}
	}
	const triviaIntervalId = setInterval(() => {
		if (triviaState[roomName]) {
			--secondsRemaining;
			io.in(roomName).emit('trivia-seconds-remaining', { questionNumber, secondsRemaining });


			if (secondsRemaining === 0) {
				io.in(roomName).emit('trivia-post-question-score', { state: triviaState[roomName], questionNumber });
			}
			//? 3 buffer seconds
			if (secondsRemaining === -3) {
				clearInterval(triviaIntervalId);
				//? with time up, calculate the scores for the users
				io.in(roomName).emit('trivia-post-question-score', { state: triviaState[roomName], questionNumber });
				//? last question finished
				if (questionNumber === triviaState[roomName].questions.length) {
					console.log(`Game ended`);
					io.in(roomName).emit('trivia-post-game', { state: 'postGame' });
					triviaState[roomName] = null;
					return;
				}

				startQuestionInterval(roomName, ++questionNumber, io)
			}

			//? check to see if everyone is ready
			let everyoneReady = true;
			for (let i = 0; i < triviaState[roomName].players.length; i++) {
				if (triviaState[roomName].players[i].ready === false) {
					everyoneReady = false
				}
			}

			if (everyoneReady && !readyCheckedOnce) {
				readyCheckedOnce = true;
				secondsRemaining = 1;
				console.log(`All players are readied`);
				io.in(roomName).emit('trivia-post-question-score', { state: triviaState[roomName], questionNumber });
			}
		}
		else {
			clearInterval(triviaIntervalId);
		}
	}, 1000);

}

function handleTriviaDisconnect(socket, roomCode, io) {

	//? Leave room socket is in
	socket.leave(roomCode);
	delete triviaClientRooms[socket.id];
	if (triviaState[roomCode] && triviaState[roomCode].players && triviaState[roomCode].players.length >= 2) {
		//? Player has left but are still users playing the game. Remove only the player who left the game
		for (let i = 0; i < triviaState[roomCode].players.length; i++) {
			if (triviaState[roomCode].players[i].socketId === socket.id) {
				triviaState[roomCode].players.splice(i, 1);
				break;
			}
		}
	}
	else if (triviaState[roomCode] && triviaState[roomCode].players && triviaState[roomCode].players.length <= 1) {
		//? Only one player remains and they have left. Remove the game state completely.
		delete triviaState[roomCode];
	}
	handleLeaveGameEvent(io, roomCode, triviaState[roomCode]);
}

function handleLeaveGameEvent(io, roomCode, state) {
	io.in(roomCode).emit('trivia-join-game-all', state);
}