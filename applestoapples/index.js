'use strict';


module.exports = {
	applestoapplesSocketEventHandler
};

const { count } = require('console');
const { construct } = require('core-js/fn/reflect');
//? Global utilities
const { makeId } = require('../utils');

//? Game constants
const {
	MAX_APPLESTOAPPLES_LOBBY_SIZE
} = require('./constants');

//? Game utils
const {
	applestoapplesInitState,
	applestoapplesJoinGame,
	applestoapplesReadyUp
} = require('./util');

//? State Mechanisms
let applestoapplesState = {};
let applestoapplesClientRooms = {};

/** 
 * This function listens to and handles all socket events for the game snake
 * @param socket A Socket.IO socket object 
 * @param io A Socket.IO instance 
 */

 function applestoapplesSocketEventHandler(socket, io){

	socket.on('applestoapples-init-game', handleApplestoapplesInitGame);
	socket.on('applestoapples-join-game', handleApplestoapplesJoinGame);
	socket.on('applestoapples-ready-up', handleApplestoapplesReadyUp);
	socket.on(`applestoapples-psend-card`, handlePlayerSentCard);
	socket.on(`applestoapples-score`, handlescore);

	function handlePlayerSentCard(data) // this function is used for when a player clicks on a red card in hand
	{	
		const cardname = data.card;
		const roomName = data.roomName;
		const playerNumber =data.playerNumber
	
	
	
	
		
	var counter = 0;
		
			applestoapplesState[roomName].players[playerNumber-1].ready=true;
		applestoapplesPlayCardEmit(roomName, cardname, playerNumber, io);
		for (let i = 0; i < applestoapplesState[roomName].players.length ; i++) {
			if (applestoapplesState[roomName].players[i].ready== true)
			{counter++;
			}
		
			if (counter ==applestoapplesState[roomName].players.length - 1)
			 {
				
				applestoapplesAllowJudgeEmit(roomName,io);
			}
			
		}
		if ( counter !=applestoapplesState[roomName].players.length - 1 )
		{
			return
		}
	}

	function handlescore(data)
	{
		const roomName = data.roomName;
		const playerNumber = data.playerNumber;
		applestoapplesState[roomName].players[playerNumber-1].score =applestoapplesState[roomName].players[playerNumber-1].score + 10;
		const name = applestoapplesState[roomName].players[playerNumber-1].username;
		const score =applestoapplesState[roomName].players[playerNumber-1].score;
		console.log(applestoapplesState[roomName].players[playerNumber-1].score);
		if (applestoapplesState[roomName].players[playerNumber-1].score > 80)
		{
			applestoapplesclearInplayemit(roomName,applestoapplesState[roomName],io);
			applestoapplesWinNotifyAll(roomName,playerNumber,score,name,io);

			return;
		}
		applestoapplesclearInplayemit(roomName,applestoapplesState[roomName],io);
		var counter= 0;
		for (let i = 0; i < applestoapplesState[roomName].players.length ; i++){
			
			
			if(applestoapplesState[roomName].players[i].ready == true)
			{	console.log('drawcard player '+ i);
				var player = i+1;
				
				var card;
				card = (applestoapplesState[roomName].cards.pop());
				applestoapplesDrawOneCardEmit(roomName, card,player,io)

			}
			if(applestoapplesState[roomName].players[i].judge == true)
			{
				counter ++;
			}
			
			applestoapplesState[roomName].players[i].ready = false;

			
			
		}
		
		
		if (counter == applestoapplesState[roomName].players.length)
		{
			resetjudges(roomName);
		}
		for (let i = 0; i < applestoapplesState[roomName].players.length ; i++)
			{	
				
				if(applestoapplesState[roomName].players[i].judge == false)
				{
					applestoapplesState[roomName].players[i].judge = true;
					var newJudge = i+1
					applestoapplessendjudgestatustoplayer(roomName, newJudge, io);
					
					break;

				}
				
				
				counter++;
				
			}
			
			console.log('sending next green card');
			var greencard = applestoapplesState[roomName].greencards.pop();
			applestoapplessendgreencardtoplayer(roomName,io,greencard);


	}
	function resetjudges(roomName){
		for (let y = 0; y < applestoapplesState[roomName].players.length ; y++)
		{
		applestoapplesState[roomName].players[y].judge =false
		}
	}
	function handleApplestoapplesInitGame(data) {
		console.log(`handleapplestoapplesInitGame called`);
		//? If no username is provided, ignore the request
		if (!data || !data.username) return;

		//? Get the necessary values for initializing a new applestoapples game
		const username = data.username;
		const id = socket.id;
		const roomName = makeId(5);

		//? Track what room the user is in 
		applestoapplesClientRooms[id] = roomName;
		//? Track applestoapples state
		applestoapplesState[roomName] = applestoapplesInitState(username, id);

		//? Add user to room code
		socket.join(roomName);
		//? Assign the user's player number
		socket.number - applestoapplesState[roomName].players.length;
		//? Send state information to user
		console.log(`init game event callback`);
		socket.emit(
			`applestoapples-init-game`,
			{
				playerNumber: socket.number,
				state: applestoapplesState[roomName],
				roomName, gameStatus: 'preGame'
			}
		);
	}
	function shuffleArray(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
	}
	function handleApplestoapplesJoinGame(data) {
		console.log('Join Game Event');
		console.log(data);
		//? Ensure the required data is given
		if (!data || !data['roomCode'] || !data['username']) {
			console.log('Not all data provided');
			return;
		}
		const { roomCode, username } = data;
		console.log(`All data provided`);

		//? Get the room the user is requesting to join
		const room = io.sockets.adapter.rooms.get(roomCode);
		console.log(room)

		//? If the room/state was not found or the room is empty
		if (room === undefined || room.size === 0 || applestoapplesState[roomCode] === null) {
			socket.emit('applestoapples-unknown-game', { UnknownGame: 'UnknownGame' });
			return;
		}
		else if (room.size > MAX_APPLESTOAPPLES_LOBBY_SIZE) {
			//? Lobby is full
			socket.emit('applestoapples-too-many-players', { TooManyPlayers: 'TooManyPlayers' });
			return;
		}

		//? Track what room the user is in
		applestoapplesClientRooms[socket.id] = roomCode;
		//? Join the room
		socket.join(roomCode);
		//? Add the player to the applestoapples state
		applestoapplesState[data.roomCode] = applestoapplesJoinGame(username, socket.id, applestoapplesState[roomCode]);
		//? Assign player a number
		socket.number = applestoapplesState[roomCode].players.length;
		//? Send the State to the current player joining
		socket.emit(`applestoapples-join-game`, applestoapplesState[data.roomCode]);
		//? Send event to all players in the lobby to update the player list
		applestoapplesJoinGameEmit(roomCode, applestoapplesState[roomCode], io);
	}
	function handleApplestoapplesReadyUp(data) { // ready up handles ready up and selection of red cards and green card
		//? Ensure the required data is given
		if (!data || !data.roomName) return;
		const { roomName } = data;
		console.log(roomName);
		//? Ensure the state being requested exists
		if (!applestoapplesState[roomName]) return;
		
		//? Update user ready state and send to all lobby members
		applestoapplesReadyUp(socket.id, applestoapplesState[roomName]);
		applestoapplesReadyUpEmit(roomName, applestoapplesState[roomName], io);

		//? If everyone is readied, begin question interval
		
		if (applestoapplesState[roomName].players.length > 1 ) {
			//? Determine if all are readied
			for (let i = 0; i < applestoapplesState[roomName].players.length; i++) {
				if (applestoapplesState[roomName].players[i].ready === false) {
					return;
				}
				
			}
			shuffleArray(applestoapplesState[roomName].cards);
			shuffleArray(applestoapplesState[roomName].greencards);
			console.log(applestoapplesState[roomName].cards[1].name);
		
			beginApplestoApplesGame(roomName,io);
			for (let i = 0; i < applestoapplesState[roomName].players.length; i++){
				
				var box = i+1;
				var box1 =[]
				box1.push(applestoapplesState[roomName].cards.pop());
				box1.push(applestoapplesState[roomName].cards.pop());
				box1.push(applestoapplesState[roomName].cards.pop());
				box1.push( applestoapplesState[roomName].cards.pop());
				box1.push(applestoapplesState[roomName].cards.pop());
				box1.push(applestoapplesState[roomName].cards.pop());
				box1.push(applestoapplesState[roomName].cards.pop());
				
				applestoapplessendredstartingcardstoplayers(roomName,io,box1, box);
			}
			var greencard = applestoapplesState[roomName].greencards.pop();
			applestoapplesState[roomName].players[0].judge = true;
			applestoapplessendjudgestatustoplayer(roomName,1, io);
			applestoapplessendgreencardtoplayer(roomName,io,greencard);
		}
	}

	
    
 }// ^ functions for handle

 function applestoapplesJoinGameEmit(roomCode, state, io) {
	io.in(roomCode).emit('applestoapples-join-game-all', state);
}
function applestoapplesReadyUpEmit(roomCode, state, io) {
	console.log(`Sending ready up to all players`);
	io.in(roomCode).emit('applestoapples-ready-up-all', state);
}
function beginApplestoApplesGame(roomName,io)
{
	for (let i = 0; i < applestoapplesState[roomName].players.length; i++) {
		applestoapplesState[roomName].players[i].ready = false;
	}
	
	io.in(roomName).emit('change-screen',{state:applestoapplesState[roomName]} );




}
function applestoapplessendredstartingcardstoplayers(roomName,io,box1, box){

io.in(roomName).emit('start-cards-players',{x1:box1,x2:box});


}
function applestoapplessendgreencardtoplayer(roomName,io,greencard)
{
	io.in(roomName).emit('start-greencard-players',{x1:greencard});

}
function applestoapplesPlayCardEmit(roomName, cardname, playerNumber, io)
{
	io.in(roomName).emit('card-to-be-judged',{x1: cardname, x2: playerNumber});


}
function applestoapplessendjudgestatustoplayer(roomName,playerNumber,io )
{
	io.in(roomName).emit('applestoapples-judge',{x1: playerNumber});


}
function applestoapplesAllowJudgeEmit(roomName, io){
	io.in(roomName).emit('applestoapples-judging',{});

}
function applestoapplesDrawOneCardEmit(roomName, card, playerNumber, io)
{


	io.in(roomName).emit('applestoapples-drawcard',{x1: card,x2: playerNumber});

}
function applestoapplesclearInplayemit(roomName,state, io)
{
	io.in(roomName).emit('applestoapples-clear-inplay',{state:applestoapplesState[roomName]});

}
function applestoapplesWinNotifyAll(roomName, playerNumber,score,name, io)
{

	io.in(roomName).emit('applestoapples-win',{x1:playerNumber, x2: score,x3: name});

}

