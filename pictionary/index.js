'use strict';

const constants = require('./constants');
const events = require('../pictionary/events');
const { wordLists } = require('../shared/wordlists');

module.exports = {
	socketEventHandler
}

//? State Mechanisms
const state = {
	games: {},
};

/** 
 * @param Object socket 
 * @returns void
 * @description This function listens to and handles all socket events for the game pictionary
 */
function socketEventHandler(socket, io) {
	
	socket.on(events.GET_WORD_LISTS, ({ }) => {
		const wordListNames = wordLists.map(x => x.name);

		socket.emit(events.GET_WORD_LISTS, wordListNames);
	});

	socket.on(events.NEW_GAME_EVENT, ({ vip, wordListName }) => {
		console.log(`${vip.name} wants to create a game with wordlist "${wordListName}"`);

		const gameCode = generateGameCode();
		initializeGame(gameCode, wordListName, [ vip ]);

		console.log(`${vip.name} created game ${gameCode}`);
		
		socket.emit(events.GAME_CREATED_EVENT, { gameCode, players: [vip] });
		socket.join(gameCode);
	});

	socket.on(events.JOIN_GAME_EVENT, ({ gameCode, player }) => {
		console.log(`${player.name} wants to join game ${gameCode}`);

		if (!state.games[gameCode]) {
			console.log('no such game');
			socket.emit(events.GAME_JOINED_EVENT, { error: 'no such game', code: 1 });
		} else if (state.games[gameCode].started) {
			console.log('cannot join - game in progress');
			socket.emit(events.GAME_JOINED_EVENT, { error: 'game in progress', code: 2 });
		} else if (state.games[gameCode].players.length >= constants.maximumPlayers) {
			console.log('cannot join - game already has maximum players');
			socket.emit(events.GAME_JOINED_EVENT, { error: 'game already has maximum players', code: 3 });
		} else {
			console.log(`${player.name} joining game ${gameCode}`);
			state.games[gameCode].players.push(player);
			socket.emit(events.GAME_JOINED_EVENT, { gameCode, players: state.games[gameCode].players });
			socket.join(gameCode);
			io.to(gameCode).emit(events.PLAYERS_CHANGED_EVENT, { players: state.games[gameCode].players });
		}
	});

	socket.on(events.LEAVE_GAME_EVENT, ({ gameCode, player }) => {
		console.log(`${player.name} wants to leave game ${gameCode}`);

		if (!state.games[gameCode]) {
			console.log('no such game');
		} else {
			console.log(`${player.name} left game ${gameCode}`);

			state.games[gameCode].players = state.games[gameCode].players.filter(x => x.id !== player.id);
			state.games[gameCode].remainingPlayers = state.games[gameCode].players.filter(x => x.id !== player.id);

			socket.leave(gameCode);
			io.to(gameCode).emit(events.PLAYERS_CHANGED_EVENT, { players: state.games[gameCode].players });

			if (state.games[gameCode].players.length <= constants.minimumPlayers ) {
				stopGame(gameCode);
			} else {
				if (player.isVIP) {
					state.games[gameCode].players[0].isVIP = true;
				}

				if (state.games[gameCode].activePlayer.id === player.id) {
					startNextRound(gameCode, state.games[gameCode].timer);
				}
			}
			
		}

		socket.emit(events.GAME_LEFT_EVENT, { gameCode, player });
	});

	socket.on(events.START_GAME_EVENT, ({ gameCode }) => {
		console.log(`starting game ${gameCode}`);

		if (!state.games[gameCode]) {
			console.log('no such game');
		} else {
			startGame(gameCode);
		}
	});

	socket.on(events.STOP_GAME_EVENT, ({ gameCode }) => {
		console.log(`stopping game ${gameCode}`);

		if (!state.games[gameCode]) {
			console.log('no such game');
		} else {
			stopGame(gameCode);
		}
	});

	socket.on(events.RESTART_GAME_EVENT, ({ gameCode }) => {
		console.log(`restarting game ${gameCode}`);

		if (!state.games[gameCode]) {
			console.log('no such game');
		} else {
			reinitializeGame(gameCode);
			startGame(gameCode);
		}
	});

	socket.on(events.INITIALIZE_ROUND_EVENT, ({ gameCode }) => {
		console.log('initializing round for game', gameCode);
		initializeRound(gameCode);
		emitGameStatus(gameCode);
	});

	socket.on(events.GET_ROUND_WORDS_EVENT, ({ gameCode }) => {
		console.log('getting round words for game ', gameCode);

		if (!state.games[gameCode]) {
			console.log('no such game');
		} else {
			try {
				socket.emit(events.GET_ROUND_WORDS_EVENT, getRoundWords(gameCode));
			} catch (error) {
				console.log('could not get round words', error);
				stopGame(gameCode, "There are no more words.");
			}
		}
	});

	socket.on(events.START_ROUND_EVENT, ({ gameCode, roundWord }) => {
		console.log('starting round ', {gameCode, roundWord});

		if (!state.games[gameCode]) {
			console.log('no such game');
		} else {
			startRound(gameCode, roundWord);
			startRoundEndTimer(gameCode);
		}
	});

	socket.on(events.SUBMIT_GUESS_EVENT, ({ gameCode, player, guess }) => {
		console.log(`${player.name} submitted a guess for game ${gameCode}`);

		const isCorrect = isCorrectGuess(gameCode, guess);
		calculatePlayerScore(gameCode, player, isCorrect);
		state.games[gameCode].guesses.push({ player, guess, isCorrect });

		socket.emit(events.SUBMIT_GUESS_EVENT, { correctGuess: isCorrect });
		io.to(gameCode).emit(events.GUESS_SUBMITTED_EVENT, { guesses: state.games[gameCode].guesses });

		handleCorrectGuesses(isCorrect, gameCode);
	});
	
	socket.on(events.CANVAS_UPDATED, ({ gameCode, canvas }) => {
		io.to(gameCode).emit(events.CANVAS_UPDATED, { canvas });
	});

	const emitGameStatus = (gameCode) => {
		if (!state.games[gameCode]) {
			console.log('no such game');
		} else {
			const publicGameState = getPublicGameState(gameCode);
			io.to(gameCode).emit(events.GAME_STATUS_EVENT, { ...publicGameState });
		}
	};

	const initializeGame = (gameCode, wordListName, players) => {
		state.games[gameCode] = {
			players,
			wordListName,
			currentRound: 0,
			guesses: [],
			roundWord: '',
			started: false,
			stopped: false,
		};
	};

	const reinitializeGame = (gameCode) => {
		state.games[gameCode].currentRound = 0;
		state.games[gameCode].guesses = [];
		state.games[gameCode].roundWord = '';
		state.games[gameCode].started = false;
		state.games[gameCode].stopped = false;
		state.games[gameCode].players.forEach(player => {
			player.score = 0;
		});
	};

	const startGame = (gameCode) => {
		state.games[gameCode].started = true;
		startPreRound(gameCode);
		io.to(gameCode).emit(events.GAME_STARTED_EVENT, { });
	};

	const stopGame = (gameCode, message) => {
		console.log(`stopping game ${gameCode}`);
		
		state.games[gameCode].stopped = true;
		socket.emit(events.STOP_GAME_EVENT, { message });
		io.to(gameCode).emit(events.GAME_STOPPED_EVENT, {});
		emitGameStatus(gameCode);

		console.log('deleting ', gameCode);
		delete state.games[gameCode];
	};

	const startPreRound = (gameCode) => {
		initializeRound(gameCode);
		checkForNoMoreRounds(gameCode);
		emitGameStatus(gameCode);
	};	

	const startRoundIn = (gameCode, delay) => {
		console.log('starting next round in ', delay);
		setTimeout(() => {
			startPreRound(gameCode);
		}, delay);
	}

	const startRound = (gameCode, roundWord) => {
		state.games[gameCode].roundWord = roundWord;
		updateRemainingWords(gameCode, roundWord);
		state.games[gameCode].roundStarted = true;
		state.games[gameCode].roundTimer = +constants.roundTimer;
		state.games[gameCode].timer = setInterval(() => {
			if (state.games[gameCode]) {
				state.games[gameCode].roundTimer = state.games[gameCode].roundTimer - 1;
				emitGameStatus(gameCode);
			}
		}, 1000);

		io.to(gameCode).emit(events.ROUND_STARTED_EVENT, {});
		emitGameStatus(gameCode);
	}

	const endRound = (gameCode, timer) => {
		clearInterval(timer);
		state.games[gameCode].roundStarted = false;
		io.to(gameCode).emit(events.ROUND_ENDED_EVENT, {});
		emitGameStatus[gameCode];
	};

	const startNextRound = (gameCode, timer) => {
		endRound(gameCode, timer);
		startRoundIn(gameCode, (+constants.interRoundTimer * 1000));
	};

	const startRoundEndTimer = (gameCode) => {
		setTimeout(() => {
			if (state.games[gameCode]) {
				startNextRound(gameCode, state.games[gameCode].timer);
			} else {
				clearInterval(state.games[gameCode].timer);
			}
		}, +constants.roundTimer * 1000);
	};

	const initializeRound = (gameCode) => {
		console.log('initializing round for ', gameCode);

		if (!state.games[gameCode]) {
			console.log('no such game');
		} else {
			state.games[gameCode].currentRound += 1;
			state.games[gameCode].activePlayer = getNextPlayer(gameCode);
			state.games[gameCode].guesses = [];
			state.games[gameCode].roundStarted = false;
			state.games[gameCode].roundTimer = 0;
			state.games[gameCode].numberCorrectGuesses = 0;
			state.games[gameCode].allPlayersGuessedCorrectly = false;
			
			socket.emit(events.ROUND_INITIALIZED_EVENT, {});
		}
	};

	const checkForNoMoreRounds = (gameCode) => {
		const totalRounds = state.games[gameCode].players.length * constants.roundsPerPlayer;
		const nextRound = state.games[gameCode].currentRound;

		if (nextRound > totalRounds) {
			console.log('no more rounds');
			state.games[gameCode].stopped = true;
		}
	};

	const handleCorrectGuesses = (isCorrect, gameCode) => {
		if (isCorrect) {
			state.games[gameCode].numberCorrectGuesses += 1;

			if (state.games[gameCode].numberCorrectGuesses === state.games[gameCode].players.length - 1) {
				state.games[gameCode].allPlayersGuessedCorrectly = true;
				startNextRound(gameCode, state.games[gameCode].timer);
			}
		}
	};

	const calculatePlayerScore = (gameCode, player, isCorrect) => {
		const game = state.games[gameCode];
		
		if (!game || !isCorrect) {
			return;
		}

		const score = game.roundTimer * constants.baseScore;

		const playerIndex = game.players.findIndex(x => x.id === player.id);
		
		if (playerIndex < 0) {
			return;
		}
		
		const currentScore = game.players[playerIndex].score ?? 0;
		game.players[playerIndex].score = currentScore + score;

		io.to(gameCode).emit(events.PLAYERS_CHANGED_EVENT, { players: state.games[gameCode].players });
	};

}

function generateGameCode() {
	const chars = Array.from({ length: constants.codeLength }, () => {
		return String.fromCharCode(Math.floor(65 + (Math.random() * 26)));
	});
	return chars.join('');
}

function getPublicGameState(gameCode) {
	const game = state.games[gameCode];
	return !!game
		? {
			started: game.started,
			stopped: game.stopped,
			activePlayer: game.activePlayer,
			roundStarted: game.roundStarted,
			roundTimer: game.roundTimer
			}
		: {};
}

function isCorrectGuess(gameCode = '', guess = '') {
	const roundWord = state.games[gameCode].roundWord ?? '';
	return roundWord.toLowerCase() === guess.toLowerCase();
}

function getRemainingPlayers(gameCode) {
	return (state.games[gameCode].playersRemainingThisRound !== undefined && state.games[gameCode].playersRemainingThisRound.length > 0)
		? state.games[gameCode].playersRemainingThisRound
		: Array.from(state.games[gameCode].players);
}

function getNextPlayer(gameCode) {
	const remainingPlayers = getRemainingPlayers(gameCode);
	const nextPlayer = popRandomArrayElement(remainingPlayers);
	state.games[gameCode].playersRemainingThisRound = remainingPlayers;

	return nextPlayer;
}

function getGameWords(gameCode) {
	const wordListName = state.games[gameCode].wordListName;
	const wordList = wordLists.find(x => x.name === wordListName) ?? {};

	return Array.from(wordList.words ?? []);
}

function getRemainingWords(gameCode) {
	return (state.games[gameCode].remainingWords !== undefined && state.games[gameCode].remainingWords.length > 0)
		? state.games[gameCode].remainingWords
		: getGameWords(gameCode);
}

function updateRemainingWords(gameCode, roundWord) {
	const unusedRoundWords = (state.games[gameCode].roundWords ?? []).filter(x => x !== roundWord);
	state.games[gameCode].remainingWords = new Array().concat(state.games[gameCode].remainingWords, unusedRoundWords);
}

function getRoundWords(gameCode) {
	let remainingWords = getRemainingWords(gameCode);

	if (!remainingWords || remainingWords.length < constants.wordChoicesPerRound) {
		throw new Error('No more words in word bank');
	}

	const roundWords = Array.from({ length: constants.wordChoicesPerRound }, () => popRandomArrayElement(remainingWords));
	state.games[gameCode].roundWords = roundWords;
	state.games[gameCode].remainingWords = remainingWords;

	return roundWords;
}

function popRandomArrayElement(array) {
	return array.splice(Math.floor(Math.random() * array.length), 1)[0];
}