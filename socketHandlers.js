const {applestoapplesSocketEventHandler} = require("./applestoapples");
const { asteroidsSocketEventHandler } = require("./asteroids");
const { battleshipSocketEventHandler } = require("./battleship");
const { checkersSocketEventHandler } = require("./checkers");
const { connectfourSocketEventHandler } = require("./connectfour");
const { hangmanSocketEventHandler } = require("./hangman");
const { snakeSocketEventHandler } = require("./snake");
const { triviaSocketEventHandler } = require("./trivia");
const { playerStatusEventHandler } = require("./playerStatusHandler");
const { tictactoeSocketEventHandler } = require("./tictactoe");
const { spaceinvadersSocketEventHandler } = require("./spaceinvaders");
const { spaceraceSocketEventHandler } = require("./spacerace");
const { pongSocketEventHandler } = require("./pong");
const { minesweeperSocketEventHandler } = require("./minesweeper");
const { tetrisSocketEventHandler } = require("./tetris");
const { socketEventHandler: pictionarySocketEventHandler } = require('./pictionary');

module.exports = {
	asteroidsSocketEventHandler,
	battleshipSocketEventHandler,
	checkersSocketEventHandler,
	connectfourSocketEventHandler,
	hangmanSocketEventHandler,
	applestoapplesSocketEventHandler,
	snakeSocketEventHandler,
	triviaSocketEventHandler,
	playerStatusEventHandler,
	tictactoeSocketEventHandler,
	spaceinvadersSocketEventHandler,
	spaceraceSocketEventHandler,
	pongSocketEventHandler, 
	minesweeperSocketEventHandler,
	tetrisSocketEventHandler,
	pictionarySocketEventHandler,
}