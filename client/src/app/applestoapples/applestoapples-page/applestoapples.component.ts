
import { Component, OnInit, QueryList, ViewChildren, ViewChild, ViewContainerRef, ComponentFactory, ComponentRef, ComponentFactoryResolver, AfterViewInit } from '@angular/core';

import { createImportSpecifier, createQualifiedName, forEachChild, sortAndDeduplicateDiagnostics, StringLiteralLike } from 'typescript';


import { ApplestoapplesService } from './../services/applestoapples.services';



@Component({
	selector: 'app-applestoapples',
	templateUrl: './applestoapples.component.html',
	styleUrls: ['./applestoapples.component.css'],
})
export class ApplestoapplesComponent implements OnInit {
    
    
    // user values
	username: string;
	playerNumber: number;
    
    // game values
	gameState: any;
	gameStatus: string = "preGame";
	previousGameStatus: string = "";
	roomName: any;
	gameCodeUserInput: string;
	buttonReadyDisabled: boolean = false;

	// Elements
	readyButton: HTMLElement;
	newGameButton: HTMLElement;
	joinGameButton: HTMLElement;
	initialGameScreen: HTMLElement;
	lobbyScreen: HTMLElement;
	playerScore: HTMLElement;
	gameScreen: HTMLElement;
	playScreen: HTMLElement;
	questionScreen: HTMLElement;
	gameOverScreen: HTMLElement;
	usernameInputField: HTMLInputElement;
	gameCodeInputField: HTMLInputElement;
	showCorrectAnswerElement: HTMLElement;
	hand :HTMLElement;

	theJudge: boolean = false;
	
	myLi : HTMLElement; // cards in hand
	inplayLi: HTMLElement;
	uisegmentHand:HTMLElement; // a bar that is used to prevent players from clicking cards in hand
	uisegmentInplay:HTMLElement; // a bar that is used to prevent players from clicking on cards next to green card
	myGreen:HTMLElement;
	 inplay: HTMLElement
	secondsRemaining: number;
	redCardNumber: number =0;
    cardsInplay: any = [];
	plofCard: any = [];
   

    myinstance : any;
    constructor(
		private resolver: ComponentFactoryResolver,
		private applestoapplesService: ApplestoapplesService,
		

	){}
    
    ngOnInit(): void {
      
      
        this.handleJoinGame();
		this.handleReadyUpEvent();
		this.handleChangetoPlayscreen();
		this.handleJudgeStatus();
		this.handlestartcards();
		this.handlestartgreencard();
		this.handlecardstobejudged();
		this.handleallowJudging();
		this.handledrawcard();
		this.handleClearInplay();
		this.handleWin();
		//this.handleUnknownGame();
		//this.handleReadyUpEvent();
        	// elements
		
		this.hand =document.querySelector('#hand');


		this.playScreen = document.querySelector('.play-screen');
		this.newGameButton = document.querySelector('#newGameButton');
		this.joinGameButton = document.querySelector('#joinGameButton');
		this.initialGameScreen = document.querySelector('#initial-game-screen');
		this.lobbyScreen = document.querySelector('.lobby-screen');
		this.playerScore = document.querySelector('.score');
		this.gameScreen = document.querySelector('.game-screen');
		this.questionScreen = document.querySelector('.question-screen');
		this.gameOverScreen = document.querySelector('.game-over-screen');
        
		this.usernameInputField = document.querySelector('#usernameInput');
		this.gameCodeInputField = document.querySelector('#gameCodeInput');
		this.showCorrectAnswerElement = document.querySelector('#show-correct-answer');
       
		this.myLi = document.querySelector('.handelement');
		this.inplayLi= document.querySelector('.inplayelement');
		this.myGreen = document.querySelector('.inplay2');
		this.inplay = document.querySelector('#inplay');
		this.uisegmentHand= document.querySelector('.ui-basic-segment')
		this.uisegmentInplay=document.querySelector('.ui-basic-segment2')
		// event listeners
		this.readyButton = document.querySelector('#buttonReady');
		this.readyButton.addEventListener('click', this.handleButtonReadyClick.bind(this));
		 this.newGameButton.addEventListener('click', this.init.bind(this));
		this.joinGameButton.addEventListener('click', this.joinGame.bind(this));
		
		this.uisegmentInplay.style.pointerEvents = 'all';
		this.uisegmentInplay.style.display= 'none';
	}

    joinGame() {
		this.username = this.usernameInputField.value;
       
		this.gameCodeUserInput = this.gameCodeInputField.value;
		this.roomName = this.gameCodeUserInput;
		this.applestoapplesService.applestoapplesJoinGame(this.gameCodeUserInput, this.username || `anonymous${Math.floor(Math.random() * 1000)}`).subscribe(data => {
			this.gameState = data;
			this.playerNumber= this.gameState.players.length;
			
			this.goToLobby();
			this.runApplestoapples();
		
		});
	}
    handleJoinGame() {
        this.applestoapplesService.applestoapplesJoinGameLobbyEvent().subscribe(data => {
			console.log(`A user has joined the lobby`);
			this.gameState = data;
			this.runApplestoapples();
            
		})
    }
	handleClearInplay()
	{	 this.applestoapplesService.applestoapplesclearInplay().subscribe(data => 
		{
			while (this.inplay.firstChild)
			{
				this.inplay.removeChild(this.inplay.firstChild);
			
			}
		console.log(data['state']);
		this.gameState = data['state'];
		console.log(this.gameState);
		this.cardsInplay= [];
		this.plofCard = [];
		let player1: string = this.gameState.players[0] ? this.gameState.players[0].username : 'No Player' 
		this.runApplestoapples();
		});
		
	}
	handleWin()
	{	
		this.applestoapplesService.applestoapplesWinNotify().subscribe(data => 
		{
			console.log('we are here in handle win');
			const pnum =data['x1'];
			const pscore= data['x2'];
			const pname = data['x3'];
			document.getElementById("gameWindowHeader1").innerHTML = 'Winner';
			
			document.getElementById("gameWindowHeader1").style.display = 'block';
			document.getElementById("gameWindowExplanation1").style.display = 'block';
			var gamewindowexp:string;
			gamewindowexp = 'The winner is player ' + pnum +', ' + pname +' with a score of ' + pscore;

			document.getElementById("gameWindowExplanation1").innerHTML = gamewindowexp;
	
	
		});


	}
	handleJudgeStatus()
	{
		this.applestoapplesService.applestoapplesJudgeStatus().subscribe(data => {
			const plNum = data['x1'];
			
			if (this.playerNumber ==plNum )
			{
				this.theJudge = true;
				this.uisegmentHand.style.pointerEvents= 'none';
				this.uisegmentHand.style.opacity = '.50';

			}
		});

	}
	handleallowJudging()
	{	
		this.applestoapplesService.applestoapplesAllowjudging().subscribe(data=>{
			
		if ( this.theJudge == true)
		{	
			this.uisegmentInplay.style.pointerEvents = 'all';
			
			}

		});
	}
	handledrawcard()
	{
		this.applestoapplesService.applestoapplesDrawCard().subscribe(data=>{
		var playernum = data['x2']
		if (playernum== this.playerNumber)
		{	var card =data['x1'];
			var text = card.name;
			this.redCardNumber++;
			console.log('drawcard ' + playernum );
			this.myLi = document.createElement('li');
			this.myLi.id = this.redCardNumber.toString();
			this.myLi.className = ".handelement";
			this.myLi.innerHTML = text;
			this.myLi.style.display = 'inline-block';
			this.myLi.style.position = 'absolute';
			this.myLi.style.width = '100px';
			this.myLi.style.background = '#e00';
			this.myLi.style.height = '150px';
			this.myLi.style.position = 'relative';
			this.myLi.style.padding = '5px';
			this.myLi.style.cursor = 'pointer';
			this.myLi.style.margin = '5px';
			this.myLi.style.boxShadow = ' -3px 6px 4px #222';
			this.hand.appendChild(this.myLi);
			this.myLi.addEventListener('click', this.handleCardClick.bind(this));
		}

		});

}
	handleCardClick (event) // event for clicking cards in hand.
	{
		console.log(event.target.innerHTML);
		const cardText = event.target.innerHTML;
		this.applestoapplesService.applestoapplesPlayerCardSend(cardText, this.roomName, this.playerNumber);
		
		event.target.remove();
		this.uisegmentHand.style.opacity= '.50';
		this.uisegmentHand.style.pointerEvents= 'none';
        
    }
	handlestartcards() {
        this.applestoapplesService.applestoapplesStartCards().subscribe(data => {
            var stuff = data['x1'];
            var playern = data['x2'];
       
            if (playern == this.playerNumber) {
                for (let index = 0; index < stuff.length; index++) {
                    console.log('making cards');
                    this.myLi = document.createElement('li');
					this.redCardNumber++
                    this.myLi.id = this.redCardNumber.toString();
                    this.myLi.className = ".handelement";
                    this.myLi.innerHTML = stuff[index].name;
                    this.myLi.style.display = 'inline-block';
                    this.myLi.style.position = 'absolute';
                    this.myLi.style.width = '100px';
                    this.myLi.style.background = '#e00';
                    this.myLi.style.height = '150px';
                    this.myLi.style.position = 'relative';
                    this.myLi.style.padding = '5px';
                    this.myLi.style.cursor = 'pointer';
                    this.myLi.style.margin = '5px';
                    this.myLi.style.boxShadow = ' -3px 6px 4px #222';
                    this.hand.appendChild(this.myLi);

                    this.myLi.addEventListener('click', this.handleCardClick.bind(this));

    

                }
            }
        });


    }

	handlestartgreencard()
	{
		this.applestoapplesService.applestoapplesStartGreenCard().subscribe(data => {
			
		const text = data['x1'];
		
			this.myGreen = document.createElement('li');
	
		var x ='green1';
	this.myGreen.id = x
	this.myGreen.innerHTML = text.name;
	this.myGreen.style.display='inline-block';
	this.myGreen.style.position='absolute';
	this.myGreen.style.width = '100px';
	this.myGreen.style.background=' #008000';
	this.myGreen.style.height= '150px';
	this.myGreen.style.position= 'relative';
	this.myGreen.style.padding= '5px';
	this.myGreen.style.cursor= 'pointer';
	this.myGreen.style.margin= '5px';
	this.myGreen.style.boxShadow=' -3px 6px 4px #222';
	this.inplay.appendChild(this.myGreen);
		
		
		
		});

	}
	handlecardstobejudged()// a card that has clicked from hand will create element in inplay list to be judged
	 {
		this.applestoapplesService.applestoapplesCardtobeJudged().subscribe(data => {
			
			var text = data['x1'];
			
			var plNumber =data['x2'];
			
			this.inplayLi = document.createElement('li');
		
			this.cardsInplay.push( text);
			this.plofCard.push( plNumber);
		
			var x =this.cardsInplay.length +1000
		this.inplayLi.id = x.toString();
		this.inplayLi.innerHTML = text;
		
		this.inplayLi.style.display='inline-block';
		this.inplayLi.style.position='absolute';
		this.inplayLi.style.width = '100px';
		this.inplayLi.style.background='#e00';
		this.inplayLi.style.height= '150px';
		this.inplayLi.style.position= 'relative';
		this.inplayLi.style.padding= '5px';
		this.inplayLi.style.cursor= 'pointer';
		this.inplayLi.style.margin= '5px';
		this.inplayLi.style.boxShadow=' -3px 6px 4px #222';
		this.inplay.appendChild(this.inplayLi);
		this.inplayLi.addEventListener('click', this.handleInplayCardClick.bind(this));

		});
	}
	handleInplayCardClick(event) {
		console.log(event.target.innerHTML);
		var text = event.target.innerHTML
		var scorer:any;
		let element= event.target.parentElement;
		for (let index = 0; index < this.cardsInplay.length; index++) {
		

			if (text == this.cardsInplay[index])
			{
				scorer = this.plofCard[index]
			
				var playerNum = Number(scorer);
				this.applestoapplesService.applestoapplesScore(this.roomName,scorer);

			}
			
		}
		
		while (element.firstChild)
		{
			console.log(element.firstChild);
			element.removeChild(element.firstChild);
		
		}
	
		this.theJudge = false;
		this.uisegmentHand.style.opacity= '.99';
		this.uisegmentHand.style.pointerEvents = 'all';
		this.uisegmentInplay.style.pointerEvents = 'none';
	}
	handleChangetoPlayscreen(){
		this.applestoapplesService.applestoapplesChangetoPlayScreen().subscribe(data => {
			
			document.getElementById("buttonReady").style.display = "none";
			document.getElementById("gameWindowExplanation1").style.display = "none";
			document.getElementById("gameWindowHeader1").style.display = "none";
			document.getElementById("intHeader2Div").style.display = "none";
			document.getElementById("play-screen").style.display = "block";
			this.uisegmentInplay.style.pointerEvents = 'none';
			this.uisegmentInplay.style.display= 'block';
			this.gameStatus = `inGame`;
			this.gameState = data['state'];
			
			this.runApplestoapples();
				
			
			
			
			

		});
		
	
	}
	
	handleReadyUpEvent() {
		this.applestoapplesService.applestoapplesReadyUpEventAll().subscribe(data => {
			console.log(`Ready Up Event received back`);
			
			this.gameState = data;
			console.log(data);
			console.log(this.gameState);
			let player1: string = this.gameState.players[0] 
			this.runApplestoapples();
		});
	}

    init() {
		
	
		this.username = this.usernameInputField.value;
     
        
		this.applestoapplesService.applestoapplesInitGame(this.username || `anonymous${Math.floor(Math.random() * 1000)}`).subscribe(data => {
			
			this.playerNumber = data['playerNumber'];
			this.gameState = data['state'];
			this.roomName = data['roomName'];
			this.gameStatus = data['gameStatus'];
			this.previousGameStatus = data['gameStatus'];

			
			console.log('Going to Lobby');
			this.goToLobby()
			this.runApplestoapples();
			this.playerNumber= this.gameState.players.length;
		});
		


	}
    goToLobby() {
		console.log(`Going to lobby`);
		this.initialGameScreen.style.display = 'none';
		this.gameScreen.style.display = 'block';
        console.log(`this.initialGameScreen.style.display: ${this.initialGameScreen.style.display}`);
		console.log(`this.gameScreen.style.display: ${this.gameScreen.style.display}`);

	
	}



    handleButtonReadyClick() {
		// let gameState: string = "preGame"; //replace with gamestate IO
		// let gameState: string = "postGame"; //replace with gamestate IO
		// let gameState: string = "question1"; //replace with gamestate IO
		// define answer submit or ready up
		if (this.gameStatus == "preGame") {
			console.log(`Ready Up`);
			//replace and update the IsReady variable in socket IO
			// send ready up event
			this.buttonReadyDisabled = true;
			this.applestoapplesService.applestoapplesReadyUp(this.roomName);
		}
		else if (this.gameStatus == "postGame") {
			//do nothing for no
			// this will be rematch
			this.buttonReadyDisabled = true;
		}
		
			this.buttonReadyDisabled = true;
		}
	
    

    runApplestoapples() {
		
		// let gameState: string = "preGame"; //replace with gamestate IO
		// let gameState: string = "postGame"; //replace with gamestate IO
		//  let gameState: string = "question1"; //replace with gamestate IO 
		let player1: string = this.gameState.players[0] ? this.gameState.players[0].username : 'No Player' //call playername socket (1-20 char)
		let player1ready: string = this.gameState.players[0]
			? (
				this.gameState.players[0].ready
					? 'Is Ready'
					: 'Is NOT Ready'
			)
			: ''//call playername "isReadY socket (boolean)
		let player1Score: string = this.gameState.players[0] ? this.gameState.players[0].score : 0 //call playerscore socket (num 1-1500)
		let player2: string = this.gameState.players[1] ? this.gameState.players[1].username : 'No Player';
		let player2ready: string = this.gameState.players[1]
			? (
				this.gameState.players[1].ready
					? 'Is Ready'
					: 'Is NOT Ready'
			)
			: '';
		let player2Score: number = this.gameState.players[1] ? this.gameState.players[1].score : 0;
		let player3: string = this.gameState.players[2] ? this.gameState.players[2].username : 'No Player';
		let player3ready: string = this.gameState.players[2]
			? (
				this.gameState.players[2].ready
					? 'Is Ready'
					: 'Is NOT Ready'
			)
			: ''
		let player3Score: number = this.gameState.players[2] ? this.gameState.players[2].score : 0;
		let player4: string = this.gameState.players[3] ? this.gameState.players[3].username : 'No Player';
		let player4ready: string = this.gameState.players[3]
			? (
				this.gameState.players[3].ready
					? 'Is Ready'
					: 'Is NOT Ready'
			)
			: ''
		let player4Score: number = this.gameState.players[3] ? this.gameState.players[3].score : 0;
		let player5: string = this.gameState.players[4] ? this.gameState.players[4].username : 'No Player';
		let player5ready: string = this.gameState.players[4]
			? (
				this.gameState.players[4].ready
					? 'Is Ready'
					: 'Is NOT Ready'
			)
			: ''
		let player5Score: number = this.gameState.players[4] ? this.gameState.players[4].score : 0;
		let player6: string = this.gameState.players[5] ? this.gameState.players[5].username : 'No Player';
		let player6ready: string = this.gameState.players[5]
			? (
				this.gameState.players[5].ready
					? 'Is Ready'
					: 'Is NOT Ready'
			)
			: ''
		let player6Score: number = this.gameState.players[5] ? this.gameState.players[5].score : 0;
		let player7: string = this.gameState.players[6] ? this.gameState.players[6].username : 'No Player';
		let player7ready: string = this.gameState.players[6]
			? (
				this.gameState.players[6].ready
					? 'Is Ready'
					: 'Is NOT Ready'
			)
			: ''
		let player7Score: number = this.gameState.players[6] ? this.gameState.players[6].score : 0;
		let player8: string = this.gameState.players[7] ? this.gameState.players[7].username : 'No Player';
		let player8ready: string = this.gameState.players[7]
			? (
				this.gameState.players[7].ready
					? 'Is Ready'
					: 'Is NOT Ready'
			)
			: ''
		let player8Score: number = this.gameState.players[7] ? this.gameState.players[7].score : 0;
	
            //display variables
            let playerHeader1: string;
    
   
            let gameWindowHeader1: string;
           
            let gameWindowExplanation1: string;
            let gameWindowExplanation2: string;
    

            //Button and scoring
            // let timerCountDown: number = 9999; //replace with socket IO game timer (number 1 - 40)
    
            //Ready Button
            let buttonLable: string;
    
            //Player controls
    
            
                // main window play screen setup for the pre game
    
                gameWindowHeader1 = "How to play";
                document.getElementById("gameWindowHeader1").innerHTML = gameWindowHeader1;
    
                gameWindowExplanation1 = "Apples to apples is a game where players will draw 7 red cards and a judge will draw a green card. Non-judge players will then select a red card that best pairs with the green card. The judge will select the red card that he believes best suits the green card and will give ten points to the player that submitted that card. The judge will then be the next player.";
                document.getElementById("gameWindowExplanation1").innerHTML = gameWindowExplanation1;
    
              
                gameWindowExplanation2 = `Send this code <span style="color: #d81e05">${this.roomName}</span> to the other players who want to join this game. Once everyone is in the game, all players must press the ready button to start the game`;
                document.getElementById("gameWindowExplanation2").innerHTML = gameWindowExplanation2;
    
                //Div section
                //Turnon header2
           
    
                //Button
                buttonLable = "Ready"
                document.getElementById("buttonReady").innerHTML = buttonLable;
    
                playerHeader1 = "Welcome Players";
                document.getElementById("playerHeader1").innerHTML = playerHeader1;
				if (this.gameStatus == "preGame")
				{
                document.getElementById("nameSetup1").innerHTML = "Player 1: " + player1 + " --- " + player1ready;
                document.getElementById("nameSetup2").innerHTML = "Player 2: " + player2 + " --- " + player2ready;
                document.getElementById("nameSetup3").innerHTML = "Player 3: " + player3 + " --- " + player3ready;
                document.getElementById("nameSetup4").innerHTML = "Player 4: " + player4 + " --- " + player4ready;
                document.getElementById("nameSetup5").innerHTML = "Player 5: " + player5 + " --- " + player5ready;
                document.getElementById("nameSetup6").innerHTML = "Player 6: " + player6 + " --- " + player6ready;
                document.getElementById("nameSetup7").innerHTML = "Player 7: " + player7 + " --- " + player7ready;
                document.getElementById("nameSetup8").innerHTML = "Player 8: " + player8 + " --- " + player8ready;
             
				}
				else{

					document.getElementById("nameSetup1").innerHTML = player1 + ": " + player1Score;
					document.getElementById("nameSetup2").innerHTML = player2 + ": " + player2Score;
					document.getElementById("nameSetup3").innerHTML = player3 + ": " + player3Score;
					document.getElementById("nameSetup4").innerHTML = player4 + ": " + player4Score;
					document.getElementById("nameSetup5").innerHTML = player5 + ": " + player5Score;
					document.getElementById("nameSetup6").innerHTML = player6 + ": " + player6Score;
					document.getElementById("nameSetup7").innerHTML = player7 + ": " + player7Score;
					document.getElementById("nameSetup8").innerHTML = player8 + ": " + player8Score;
				

				}
            }




}

