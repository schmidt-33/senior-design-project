'use strict';
//? Configure dotenv to access environment variables
require('dotenv').config();

//? Import Express and make and make an instance
const express = require('express');
const app = express();

//? Import Http to create a server with the express application
const http = require('http');
const server = http.createServer(app);

//? Make a Socket.IO instance and initialize it to the HTTP server created
const io = require('socket.io')(server, {
	cors: { origin: "http://localhost:4200"}
});

//? Utility imports and declarations
const path = require('path');
const PORT = process.env.PORT || 3000;

//? Socket handlers
const {
	asteroidsSocketEventHandler,
	battleshipSocketEventHandler,
	checkersSocketEventHandler,
	applestoapplesSocketEventHandler,
	hangmanSocketEventHandler,
	pictionarySocketEventHandler,
	snakeSocketEventHandler,
	triviaSocketEventHandler,
	playerStatusEventHandler,
	tictactoeSocketEventHandler,
	connectfourSocketEventHandler,
	spaceinvadersSocketEventHandler,
	spaceraceSocketEventHandler,
	pongSocketEventHandler,
	minesweeperSocketEventHandler,
} = require('./socketHandlers');
const { tetrisSocketEventHandler } = require('./tetris');

//? client rooms
const {
	triviaClientRooms
} = require('./clientRooms');

//? Disconnect handlers
const {
	handleTriviaDisconnect
} = require('./disconnectHandlers');
const { disconnect } = require('process');

const allowedExt = [
	'.js',
	'.ico',
	'.css',
	'.png',
	'.jpg',
	'.woff2',
	'.woff',
	'.ttf',
	'.svg',
];

// app.use((req, res, next) => {
// 	res.set('cache-control', 'no-store, no-cache, must-revalidate')
// 	res.set('x-content-type-options', 'nosniff');
// 	res.set('x-xss-protection', '1; mode=block');
// 	res.set('server', 'hatchgarage');
// 	next();
// });cx

//? Ensures the files requested are the correct file type
app.get('*', (req, res) => {
	if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
		res.sendFile(path.resolve(path.join(__dirname, "client", "dist", req.url)));
	} else {
		res.sendFile(path.resolve(path.join(__dirname, "client", "dist", "index.html")));
	}
});

const addSecurityHeadersToServedFiles = (res) => {
	res.set({
		'cache-control': 'no-store, no-cache, must-revalidate',
		'x-content-type-options': 'nosniff',
		'x-xss-protection': '1; mode=block',
		'server': 'hatchgarage'
	});
}

// start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// handle a socket connection request
io.on('connection', socket => {

	socket.on('disconnect', handleDisconnect);

	//? Asteroids
	asteroidsSocketEventHandler(socket, io);

	//? Battleship
	battleshipSocketEventHandler(socket, io);
	
	//? Checkers
	checkersSocketEventHandler(socket, io);

	//? connectfour
	connectfourSocketEventHandler(socket, io);
	
	//? Apples to apples
	applestoapplesSocketEventHandler(socket, io);

	//? Hangman
	hangmanSocketEventHandler(socket, io);
	
	//? Player status
	playerStatusEventHandler(socket, io);

	//? Pictionary
	pictionarySocketEventHandler(socket, io);

	//? Snake
	snakeSocketEventHandler(socket, io);

	//? Trivia
	triviaSocketEventHandler(socket, io);

	//? Tictactoe
	tictactoeSocketEventHandler(socket, io);

	//? Space Invaders
	spaceinvadersSocketEventHandler(socket, io);

	//? Space Race
	spaceraceSocketEventHandler(socket, io);

	//? Pong
	pongSocketEventHandler(socket, io);

	//? Minesweeper
	minesweeperSocketEventHandler(socket, io);
	
	//? Tetris
	tetrisSocketEventHandler(socket, io);

	function handleDisconnect() {
		let roomCode;
		//? Check trivia
		if (socket.id in triviaClientRooms) {
			console.log(`Removing Trivia player: ${socket.id}`);
			roomCode = triviaClientRooms[socket.id];
			handleTriviaDisconnect(socket, roomCode, io);
		}
	}
});