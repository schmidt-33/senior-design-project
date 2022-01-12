"use strict";

const { emit } = require('process');
const { getWordListNames } = require('../shared/wordlists');

module.exports = {
  hangmanSocketEventHandler,
};

//? Global Utilities
const { makeId } = require("../utils");

//?Game utils
const { initHangman } = require("./util");

//? State Mechanisms
let hangmanState = {};
let hangmanClientRooms = {};

const GET_WORD_LISTS = 'get-word-lists';

/**
 * This function listens to and handles all socket events for the game snake
 * @param socket A Socket.IO socket object
 * @param io A Socket.IO instance
 */

function hangmanSocketEventHandler(socket, io) {
  socket.on(`hangman-try-guess`, handleGuess);
  socket.on(`hangman-new-game`, handleNewGame);
  socket.on(`hangman-join-game`, handleJoinGame);
  socket.on(`hangman-rematch`, handleRematch);
  socket.on(GET_WORD_LISTS, () => {
		socket.emit(GET_WORD_LISTS, getWordListNames());
	});

  //?=== Socket Handlers ===//
  function handleNewGame({ wordListName }) {
    //? Create a new room ID
    const roomName = makeId(5);
    //? Track what room the user is in
    hangmanClientRooms[socket.id] = roomName;
    //? Send the room code back to the user
    socket.emit("hangman-game-code", { gameCode: roomName });

    //? Initialize the game state
    hangmanState[roomName] = initHangman({ wordListName, guesser: socket.id });
    hangmanState[roomName].players[socket.id] = 0;

    //? Add the socket to the room
    socket.join(roomName);
    //? Assign them a player number
    socket.number = 1;
    //? send the player their number
    socket.emit("hangman-init", { socket: socket.id });
    emitGameState(roomName, hangmanState[roomName], io);
  }

  function handleJoinGame({ gameCode }) {
    //? if there is no game code present, send an unknown code response
    if (!gameCode) {
      socket.emit("hangman-unknown-game", "Unknown Game");
      return;
    }

    //? Look for the room that the user is requesting
    const room = io.sockets.adapter.rooms.get(gameCode);
    
    //? If there is no room or the room is empty, send an unknown code response
    if (!room || room.size === 0 || !hangmanState[gameCode]) {
      socket.emit("hangman-unknown-game", "Unknown Game");
      return;
    }

    hangmanState[gameCode].players[socket.id] = 0;
    //? Track which room the user is joining
    hangmanClientRooms[socket.id] = gameCode;
    //? join the room
    socket.join(gameCode);
    //? Assign them player 2
    socket.number = room.size;
    //? Emit the initialization of a new player
    socket.emit(`hangman-init`, { socket: socket.id });
    emitGameState(gameCode, hangmanState[gameCode], io);
  }

  function handleRematch({ gameCode }) {
    if (!gameCode) return;

    const players = Object.fromEntries(Object.entries(hangmanState[gameCode].players).map(x=>[x[0], 0]));
    const nextGuesser = getNextGuesser(hangmanState[gameCode].guesser, players);
    const wordListName = hangmanState[gameCode].wordListName;
    hangmanState[gameCode] = initHangman({ wordListName, guesser: nextGuesser });
    hangmanState[gameCode].players = players;
    console.log(nextGuesser);

    emitGameState(gameCode, hangmanState[gameCode], io);
  }

  function getRoomSize(gameCode) {
    const room = io.sockets.adapter.rooms.get(gameCode);
    return room.size ?? 0;
  }

  function getNextGuesser(currentGuesser, players) {
    const playerIds = Object.keys(players);
    const currentIndex = playerIds.findIndex(x => x === currentGuesser);
    const nextIndex = currentIndex + 1;
    const nextGuesser = nextIndex >= playerIds.length ? playerIds[0] : playerIds[nextIndex];

    return nextGuesser;
  }

  function handleGuess({ letter }) {
    //? Get the room name of the current user
    const roomName = hangmanClientRooms[socket.id];

    //? If the room name was not found for the user, Ignore the request
    if (!roomName || hangmanState[roomName] === null) return;

    hangmanState[roomName].guesses[letter] = true;
    const letterAsChar = String.fromCharCode(65 + letter);

    const lettersFound = findLetterInSecretWord(hangmanState[roomName].secretWord, letterAsChar)
    
    if (lettersFound > 0) {
      handleGoodGuess(roomName, letterAsChar, lettersFound);
    } else {
      handleBadGuess(roomName);
    }
    
    emitGameState(roomName, hangmanState[roomName], io);
    checkForGameOver(roomName);
  }

  function findLetterInSecretWord(secretWord, letterAsChar) {
    return secretWord.toUpperCase().split(letterAsChar).length - 1;
  }

  function handleGoodGuess(roomName, letterAsChar, lettersFound) {
    hangmanState[roomName].players[socket.id] += lettersFound;
    updateRevealedWord(roomName, letterAsChar);
  }

  function handleBadGuess(roomName) {
    hangmanState[roomName].wrongAttempts++;
    hangmanState[roomName].guesser = getNextGuesser(hangmanState[roomName].guesser, hangmanState[roomName].players);
  }

  function checkForGameOver(roomName) {
    const wordRevealed = hangmanState[roomName].revealedWord === hangmanState[roomName].secretWord;
    const maxWrongAttemptsReached = hangmanState[roomName].wrongAttempts === 6;

    if (wordRevealed || maxWrongAttemptsReached) {
      hangmanState[roomName].revealedWord = hangmanState[roomName].secretWord;
      emitGameState(roomName, hangmanState[roomName], io);
      emitGameOver(roomName, getWinners(hangmanState[roomName].players, wordRevealed), io);
    }
  }

  function updateRevealedWord(roomName, letterAsChar) {
    for (let i = 0; i < hangmanState[roomName].secretWord.length; i++) {
      if (letterAsChar === hangmanState[roomName].secretWord[i].toUpperCase()) {
        hangmanState[roomName].revealedWord =
          hangmanState[roomName].revealedWord.substring(0, i) +
          hangmanState[roomName].secretWord[i] +
          hangmanState[roomName].revealedWord.substring(i + 1);
      }
    }
  }

  function getWinners(players, wordRevealed) {
    if (!wordRevealed) {
      return [];
    }

    const highScore = Math.max(...Object.values(players));
    return Object.entries(players).filter(x => x[1] === highScore).map(x => x[0]);
  }

  /**
   * Emits a game state to all players in a lobby
   * @param String The room code to send the state to
   * @param Object The current game state for the snake game
   * @param Object A Socket.IO instance
   */
  function emitGameState(roomName, state, io) {
    io.in(roomName).emit("hangman-game-state", state);
  }

  /**
   * Emits a game over state to all players in a lobby
   * @param String The room code to send the state to
   * @param Object The current game state for the snake game
   * @param Object A Socket.IO instance
   * @param number The player number of who won
   */
  function emitGameOver(roomName, winners, io) {
    hangmanState[roomName].gameOver = true;
    emitGameState(roomName, hangmanState[roomName], io);
    io.in(roomName).emit("hangman-game-over", { winners });
  }
}
