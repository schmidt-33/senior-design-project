import { Component, OnInit, QueryList, ViewChildren, ViewChild, ViewContainerRef, ComponentFactory, ComponentRef, ComponentFactoryResolver, AfterViewInit } from '@angular/core';
import { applySourceSpanToStatementIfNeeded } from '@angular/compiler/src/output/output_ast';

import { CheckersService } from '../services/checkers.service';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { PieceComponent } from '../piece/piece.component';

import { AppState } from '../state/app.state';
import * as winActions from '../state/win.actions';
import { dispatch } from 'rxjs/internal/observable/pairs';
@Component({
	selector: 'app-checkers',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {


	//changes here vvv
	multiplayerGameButton: any;
	singleplayerGameButton: any;
	resetting: boolean = false;
	initialScreen: any;
	gameScreen: any;
	board: string[][] = [];
	gameCodeInput: any;
	gameCodeDisplay: any;
	joinGameButton: any;
	singlePlayer: boolean = true;
	playerNumber: any;
	gameCode: string;
	pieces: ComponentRef<PieceComponent>[] = [];
	turn$ = new BehaviorSubject<string>(null);

	possibleJumpers: any[] = [];
	possibleMovers: any[] = [];
	possibleJumpsBySelectedPiece: any[] = [];
	possibleMovesBySelectedPiece: any[] = [];

	possibleJumpersC: any[] = [];
	possibleMoversC: any = [];
	selectedPiece: any = [];
	selectedPieceC: any = [];
	playerPieces: any = 12;
	jumpingAgainH: boolean = false;
	jumpingAgainC: boolean = false;
	winner: string = null;
	
	wins$: Observable<number>;

	@ViewChild('piecesContainer', { read: ViewContainerRef }) entry: ViewContainerRef;

	colorPickerDisabled = false;
	playerColor: string = `#${Math.floor(Math.random() * 16777215).toString(16)}`

	counter: any;
	resetoff: boolean = false;
	gameActive = false;
	stateReceived: boolean = false;

	newGameButton: any;

	rematchButton: any;

	checkersHomeButton: any;

	canvas: any;
	ctx: any;
	
	rematchCount: number = 0;
	gameWinnerMessage: any;
	rematchButtonDisabled: boolean = true;
	checkersHomeButtonDisabled: boolean = true;
	onlineCount: number;
	gameCount: number;
	turn: string;

	constructor(
		private resolver: ComponentFactoryResolver,
		private websocketService: CheckersService,
		private store: Store<AppState>

	) {
		this.wins$ = this.store.select(state => state.wins);
	}

	// Change^^^

	ngOnInit(): void {
		// socket listeners





		this.handleGameOver();


		this.handleTooManyPlayers();
		this.handleUnknownGame();
		this.handleOnlineCount();
		this.handleRematchCount();
		this.handleGameCode();
		this.resetBoard();
		this.handleInit();
		//this.handleGameState();
		this.handleturn();
		this.handlePieceMovement();
		this.handleRemovePieceUpdate();
		this.handleWinMessage();
		
		let wins = localStorage.getItem("wins");
		if (wins) {
			this.store.dispatch(new winActions.setWins(parseInt(wins)));
		}

		// html document values 
		this.gameScreen = document.querySelector('#gameScreen');
		this.initialScreen = document.querySelector('#initialScreen');
		this.newGameButton = document.querySelector('#newGameButton');
		this.singleplayerGameButton = document.querySelector('#singlePlayerGameButton');
		this.joinGameButton = document.querySelector('#joinGameButton');
		this.gameCodeInput = document.querySelector('#gameCodeInput');
		this.gameCodeDisplay = document.querySelector('#gameCodeDisplay');
		this.rematchButton = document.querySelector('#rematchButton');
		
		this.checkersHomeButton = document.querySelector('#checkersHomeButton');
		this.counter = document.querySelector('#countdown');
		this.newGameButton.addEventListener('click', this.newGame.bind(this));
		this.singleplayerGameButton.addEventListener('click', this.singleplayerGame.bind(this));
		this.joinGameButton.addEventListener('click', this.joinGame.bind(this));
		this.rematchButton.addEventListener('click', this.rematch.bind(this));



	}
	newGame() {
		this.websocketService.checkersNewGame();
		this.resetoff= true;
		this.singlePlayer = false;
		this.init();
		this.turn ='H'
		this.turn$.next('H');
	}

	singleplayerGame() {
		this.websocketService.checkersNewGame();
		this.turn$.next('H');
		this.init();


	}

	joinGame() {
		const code = this.gameCodeInput.value;
		this.gameCode = this.gameCodeInput.value;
		this.websocketService.checkersJoinGame(code.toString());
		this.singlePlayer = false;
		this.turn ='C';
		this.init();



	}

	rematch() {
		
			this.websocketService.checkersSendRematchEvent(this.gameCode);
		
	}

	checkersHome() {
		window.location.reload();
	}

	init() {
		this.initialScreen.style.display = 'none';
		this.gameScreen.style.display = 'block';



		this.gameActive = true;

	}

	keydown(e) {
		this.websocketService.keyDownEvent(parseInt(e.keyCode))
	}

	handleInit() {
		this.websocketService.checkersInit().subscribe(data => {
			this.playerNumber = data['playerNumber'];
		});
	}
	 handlePieceMovement()
	{
		console.log("we got inside handle piece movement");
		
		this.websocketService.checkersPieceMoveUpdate().subscribe(data=>{
			
			console.log("we're inside checkers handle piece movement after websocket receive");
			
			if(this.playerNumber!= data['p']){
			let fromRow = data['x1'];
			 
		let	fromCol = data['y1'];
		let	toRow = data['x2'];
		let	toCol = data['y2'];
		console.log(fromRow);
		console.log(fromCol);
		console.log(toRow);
		console.log(toCol);
		let piece = this.pieceAtPosition(fromRow, fromCol);
		piece
		piece.instance.row = toRow;
		piece.instance.column = toCol;
		console.log("this is where a piece should move");
		console.log(piece.instance.column);
		 piece.instance.setPosition();	
	}
		});
	


	} 
	handleRemovePieceUpdate(){
		this.websocketService.checkersRemovePieceUpdate().subscribe(data=>{

			if(this.playerNumber!= data['p']){
			let removeRow = data['x1'];
			 
			let	removeCol = data['y1'];
			let removedPiece = this.pieceAtPosition(removeRow,removeCol);
				console.log(removedPiece);
			this.pieces = this.pieces.filter(p => p != removedPiece);
			removedPiece.destroy();
			this.playerPieces=this.playerPieces -1;
			}
			
		});




	}

	handleGameState() {
		this.websocketService.checkersGamestate().subscribe(data => {
			// the first state response is received, start countdown
			// console.log(data);
			this.board = data as string[][];
			this.updateBoardState();
		});
	}
	handleturn(){
	this.websocketService.checkersTurnRE().subscribe(data=>{

		
		
		if (data != this.playerNumber){

		this.turn$.next(this.turn);
				if(this.turn =='C')
				{
					

				}
				if(this.turn == 'H')
				{
					

				}
		}

});

	}
	handleWinMessage(){
		this.websocketService.checkersWinMessageUpdate().subscribe(data => {
		
			let loser = data as number;
		console.log(loser);
		if (loser!= this.playerNumber)
		{
			this.winner='H';

		}
		});
		

	}
	handleGameOver() {
		this.websocketService.checkersGameOver().subscribe(data => {
			if (this.playerNumber === parseInt(data['winner'])) {
				this.gameWinnerMessage = "You Win!";
			}
			else {
				this.gameWinnerMessage = "You Lose";
			}

			this.gameActive = false;
			this.rematchButtonDisabled = false;
			this.checkersHomeButtonDisabled = false;
			this.stateReceived = false;
		})
	}

	handleGameCode() {
		this.websocketService.checkersGameCode().subscribe(data => {
			console.log(data['gameCode'])
			this.gameCodeDisplay.innerText = data['gameCode'];
			this.gameCode = data['gameCode'];
		})
	}

	handleUnknownGame() {
		this.websocketService.checkersUnknownGame().subscribe(data => {
			this.reset();
			alert('Unknown game code');
		})
	}

	handleTooManyPlayers() {
		this.websocketService.checkersTooManyPlayers().subscribe(data => {
			this.reset();
			alert('This game is already in progress');
		})
	}

	handleOnlineCount() {
		this.websocketService.checkersOnlineCount().subscribe(data => {
			this.onlineCount = parseInt(data['rematchCount']);
		})
	}

	handleRematchCount() {
		this.websocketService.checkersRematchCount().subscribe(data => {
			this.rematchCount = parseInt(data['rematchCount']);
			console.log(parseInt(data['rematchCount']));
			if (this.rematchCount === 2) {
				this.rematchCount = 0;
				this.rematchButtonDisabled = true;
				this.checkersHomeButtonDisabled = true;
				this.resetBoard();
				



				if(this.playerNumber==1)
				{
					this.turn$.next('H');

				}
				if(this.playerNumber==2)
				{
					this.turn$.next('X');

				}
			}
		});
	}

	reset() {
		this.playerNumber = null;
		this.gameCodeInput.value = "";
		this.gameCodeDisplay.innerText = "";
		this.initialScreen.style.display = "block";
		this.gameScreen.style.display = "none";
	}

	createStartingPieces() {
		this.board.forEach((r, ir) => {
			r.forEach((c, ic) => {
				if (c) {
					this.createPiece(ir, ic, c);
				}
			})
		});
	}

	createPiece(row, column, player) {
		const factory = this.resolver.resolveComponentFactory(PieceComponent);
		const componentRef = this.entry.createComponent(factory);
		componentRef.instance.player = player;
		componentRef.instance.row = row;
		componentRef.instance.column = column;
		componentRef.instance.emitPiece.subscribe(event => {
			this.selectPiece(event);
		})
		this.pieces.push(componentRef);
	}

	updateBoardState() {
		this.pieces.forEach(p => {
			p.destroy();
		});
		this.createStartingPieces()
	}

	resetBoard() {

		if (this.resetting) return;

		this.resetting = true;
		this.winner = null;
		this.pieces.forEach(p => {
			p.destroy();
		});
		this.pieces = [];

		this.board = [
			[null, 'C', null, 'C', null, 'C', null, 'C'],
			['C', null, 'C', null, 'C', null, 'C', null],
			[null, 'C', null, 'C', null, 'C', null, 'C'],
			[null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null],
			['H', null, 'H', null, 'H', null, 'H', null],
			[null, 'H', null, 'H', null, 'H', null, 'H'],
			['H', null, 'H', null, 'H', null, 'H',null]
		];  
	/* 	this.board = [
			[null, null, null, 'H', null, 'H', null, null],
			[null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null],
			[null, null, null, 'C', null, null, null, null],
			[null, null, null, null, null, null, null, null],
			[null, null, null, null, null, 'C', null, null],
			[null, null, null, null, 'C', null, 'H', null],
		]; */
		setTimeout(() => {
			this.createStartingPieces();
			this.resetting = false;
			
		}, 500)
	}

	ngAfterViewInit() {
		this.turn$.subscribe(data => {
			setTimeout(() => {
				if (data == 'H') {
					this.startTurnH();
				}
				else if (data == 'C' && this.singlePlayer == true) {
					this.clearTurnDataH();
					this.startTurnC();
				}
				else if (data == 'C' && this.singlePlayer == false) {
					
					this.clearTurnDataC2();
					this.startTurnC2();

				}
			}, 500);
			//todo - switch to debounceTime
		})
	}

	startTurnH() {
		this.clearTurnDataH();
		this.checkForJumpsH();
		this.checkForMovesH();
	}

	clearTurnDataH() {
		this.jumpingAgainH = false;
		this.possibleJumpers = [];
		this.possibleMovers = [];
		this.possibleMovesBySelectedPiece = [];
		this.possibleJumpsBySelectedPiece = [];
		this.selectedPiece = null;
	}
	//Placing work around for multiplayer stuff here
	startTurnC2() {

		this.clearTurnDataC2();
		this.checkForJumpsC2();
		this.checkForMovesC2();
	}

	clearTurnDataC2() {
		this.jumpingAgainH = false;
		this.possibleJumpers = [];
		this.possibleMovers = [];
		this.possibleMovesBySelectedPiece = [];
		this.possibleJumpsBySelectedPiece = [];
		this.selectedPiece = null;
	}
	checkForJumpsC2() {
		this.pieces.forEach(p => {
			if (p.instance.player == 'C') {
				this.checkPieceCanJumpC2(p);
			}
		})
	}

	//beginning changes for check for moves C2 conversion for Black pieces
	checkForMovesC2() {
		this.pieces.forEach(p => {
			if (p.instance.player == 'C') {
				let row = p.instance.row;
				let column = p.instance.column;

				if (
					this.spaceExists(row + 1, column + 1) &&
					!this.pieceAtPosition(row + 1, column + 1)
				) {
					this.possibleMovers.push({
						fromRow: row,
						fromColumn: column,
						toRow: row + 1,
						toColumn: column + 1
					});
				}

				if (
					this.spaceExists(row + 1, column - 1) &&
					!this.pieceAtPosition(row + 1, column - 1)
				) {
					this.possibleMovers.push({
						fromRow: row,
						fromColumn: column,
						toRow: row + 1,
						toColumn: column - 1
					});
				}

				if (
					p.instance.isKing &&
					this.spaceExists(row - 1, column + 1) &&
					!this.pieceAtPosition(row - 1, column + 1)
				) {
					this.possibleMovers.push({
						fromRow: row,
						fromColumn: column,
						toRow: row - 1,
						toColumn: column + 1
					});
				}

				if (
					p.instance.isKing &&
					this.spaceExists(row - 1, column - 1) &&
					!this.pieceAtPosition(row - 1, column - 1)
				) {
					this.possibleMovers.push({
						fromRow: row,
						fromColumn: column,
						toRow: row - 1,
						toColumn: column - 1
					});
				}
			}
		})
		if (this.possibleJumpers.length == 0 && this.possibleMovers.length == 0) {
			this.winner = 'C';
			this.websocketService.checkersWinMessage(this.gameCode,this.playerNumber);
		}

	}

	//current converting Changes for Check Piece can Jump for black pieces
	checkPieceCanJumpC2(p) {
		let row = p.instance.row;
		let column = p.instance.column;

		if (
			this.spaceExists(row + 2, column + 2) &&
			this.pieceAtPosition(row + 1, column + 1)?.instance.player == 'H' &&
			!this.pieceAtPosition(row + 2, column + 2)
		) {
			this.possibleJumpers.push({
				fromRow: row,
				fromColumn: column,
				toRow: row + 2,
				toColumn: column + 2
			});
		}

		if (
			this.spaceExists(row + 2, column + -2) &&
			this.pieceAtPosition(row + 1, column - 1)?.instance.player == 'H' &&
			!this.pieceAtPosition(row + 2, column - 2)
		) {
			this.possibleJumpers.push({
				fromRow: row,
				fromColumn: column,
				toRow: row + 2,
				toColumn: column - 2
			});
		}

		if (
			p.instance.isKing &&
			this.spaceExists(row - 2, column + 2) &&
			this.pieceAtPosition(row -1, column + 1)?.instance.player == 'H' &&
			!this.pieceAtPosition(row - 2, column + 2)
		) {
			this.possibleJumpers.push({
				fromRow: row,
				fromColumn: column,
				toRow: row - 2,
				toColumn: column + 2
			});
		}

		if (
			p.instance.isKing &&
			this.spaceExists(row - 2, column - 2) &&
			this.pieceAtPosition(row - 1, column - 1)?.instance.player == 'H' &&
			!this.pieceAtPosition(row - 2, column - 2)
		) {
			this.possibleJumpers.push({
				fromRow: row,
				fromColumn: column,
				toRow: row - 2,
				toColumn: column - 2
			});

			
		}
		
	}

	///^^ place with in here for organization
	startTurnC() {

		this.possibleJumpersC = [];
		let possibleMoversC = [];

		this.pieces.forEach(p => {
			if (p.instance.player == 'C') {
				this.checkPieceCanJumpC(p);
			}
		})

		this.pieces.forEach(p => {
			if (p.instance.player == 'C') {
				let row = p.instance.row;
				let column = p.instance.column;

				if (
					this.spaceExists(row + 1, column - 1) &&
					!this.pieceAtPosition(row + 1, column - 1)
				) {
					possibleMoversC.push({
						fromRow: row,
						fromColumn: column,
						toRow: row + 1,
						toColumn: column - 1
					});
				}

				if (
					this.spaceExists(row + 1, column + 1) &&
					!this.pieceAtPosition(row + 1, column + 1)
				) {
					possibleMoversC.push({
						fromRow: row,
						fromColumn: column,
						toRow: row + 1,
						toColumn: column + 1
					});
				}

				if (
					p.instance.isKing &&
					this.spaceExists(row - 1, column - 1) &&
					!this.pieceAtPosition(row - 1, column - 1)
				) {
					possibleMoversC.push({
						fromRow: row,
						fromColumn: column,
						toRow: row - 1,
						toColumn: column - 1
					});
				}

				if (
					p.instance.isKing &&
					this.spaceExists(row - 1, column + 1) &&
					!this.pieceAtPosition(row - 1, column + 1)
				) {
					possibleMoversC.push({
						fromRow: row,
						fromColumn: column,
						toRow: row - 1,
						toColumn: column + 1
					});
				}
			}
		})

		if (this.possibleJumpersC.length) {
			let ji = Math.floor(Math.random() * this.possibleJumpersC.length);
			this.selectedPieceC = this.pieceAtPosition(this.possibleJumpersC[ji].fromRow, this.possibleJumpersC[ji].fromColumn);

			this.moveSelectedPieceC(this.possibleJumpersC[ji].toRow, this.possibleJumpersC[ji].toColumn);
		} else if (possibleMoversC.length) {
			let mi = Math.floor(Math.random() * possibleMoversC.length);
			this.selectedPieceC = this.pieceAtPosition(possibleMoversC[mi].fromRow, possibleMoversC[mi].fromColumn);

			this.moveSelectedPieceC(possibleMoversC[mi].toRow, possibleMoversC[mi].toColumn);
		} else {
			this.winner = 'H';
			this.store.dispatch(new winActions.addWin());
		}
	}

	checkForJumpsH() {
		this.pieces.forEach(p => {
			if (p.instance.player == 'H') {
				this.checkPieceCanJumpH(p);
			}
		})
	}

	checkForMovesH() {
		this.pieces.forEach(p => {
			if (p.instance.player == 'H') {
				let row = p.instance.row;
				let column = p.instance.column;

				if (
					this.spaceExists(row - 1, column - 1) &&
					!this.pieceAtPosition(row - 1, column - 1)
				) {
					this.possibleMovers.push({
						fromRow: row,
						fromColumn: column,
						toRow: row - 1,
						toColumn: column - 1
					});
				}

				if (
					this.spaceExists(row - 1, column + 1) &&
					!this.pieceAtPosition(row - 1, column + 1)
				) {
					this.possibleMovers.push({
						fromRow: row,
						fromColumn: column,
						toRow: row - 1,
						toColumn: column + 1
					});
				}

				if (
					p.instance.isKing &&
					this.spaceExists(row + 1, column - 1) &&
					!this.pieceAtPosition(row + 1, column - 1)
				) {
					this.possibleMovers.push({
						fromRow: row,
						fromColumn: column,
						toRow: row + 1,
						toColumn: column - 1
					});
				}

				if (
					p.instance.isKing &&
					this.spaceExists(row + 1, column + 1) &&
					!this.pieceAtPosition(row + 1, column + 1)
				) {
					this.possibleMovers.push({
						fromRow: row,
						fromColumn: column,
						toRow: row + 1,
						toColumn: column + 1
					});
				}
			}
		})

		if (this.possibleJumpers.length == 0 && this.possibleMovers.length == 0) {
			this.winner = 'C';
			this.websocketService.checkersWinMessage(this.gameCode,this.playerNumber);



		
		}
	}

	spaceIsPossibleJumper(row, column) {
		let isPossibleJumper = false;
		this.possibleJumpers.forEach(p => {
			if (p.fromRow == row && p.fromColumn == column) {
				isPossibleJumper = true;
			}
		})
		return isPossibleJumper;
	}

	spaceIsPossibleMover(row, column) {
		if (this.possibleJumpers.length) return false;

		let isPossibleMover = false;
		this.possibleMovers.forEach(p => {
			if (p.fromRow == row && p.fromColumn == column) {
				isPossibleMover = true;
			}
		})
		return isPossibleMover;
	}

	spaceIsPossibleJump(row, column) {
		let isPossibleJump = false;
		this.possibleJumpsBySelectedPiece.forEach(p => {
			if (p.row == row && p.column == column) {
				isPossibleJump = true;
			}
		})
		return isPossibleJump;
	}

	spaceIsPossibleMove(row, column) {
		let isPossibleMove = false;
		this.possibleMovesBySelectedPiece.forEach(p => {
			if (p.row == row && p.column == column) {
				isPossibleMove = true;
				
			}
		})
		return isPossibleMove;
	}

	pieceAtPosition(row, column) {
		let piece = null;
		this.pieces.forEach(p => {
			if (p.instance.row == row && p.instance.column == column) {
				piece = p;
			}
		})
		return piece;
	}

	selectPiece(event) {
		if (this.jumpingAgainH) {
			return;
		}

		this.selectedPiece = ({ row: event.row, column: event.column });
		this.possibleJumpsBySelectedPiece = [];
		this.possibleMovesBySelectedPiece = [];
		if (
			this.spaceIsPossibleJumper(event.row, event.column) ||
			this.spaceIsPossibleMover(event.row, event.column)) {
			this.highlightPossibleMoves(event);
		}
	}

	highlightPossibleMoves(event) {
		this.possibleJumpers.forEach(j => {
			if (j.fromRow == event.row && j.fromColumn == event.column) {
				this.possibleJumpsBySelectedPiece.push({
					row: j.toRow,
					column: j.toColumn
				})
			}
		});

		if (this.possibleJumpsBySelectedPiece.length) return;

		this.possibleMovers.forEach(m => {
			if (m.fromRow == event.row && m.fromColumn == event.column) {
				this.possibleMovesBySelectedPiece.push({
					row: m.toRow,
					column: m.toColumn
				})
			}
		});
	}

	moveSelectedPiece(toRow, toColumn) {
		let piece = this.pieceAtPosition(this.selectedPiece.row, this.selectedPiece.column);
		let fromRow = piece.instance.row;
		let fromColumn = piece.instance.column;
		piece.instance.row = toRow;
		piece.instance.column = toColumn;
		this.websocketService.checkersPieceMove( fromRow ,fromColumn,toRow,toColumn,this.gameCode,this.playerNumber)
		//? Update the board
		const player = piece.instance.setPosition();
		this.board[fromRow][fromColumn] = null;
		this.board[toRow][toColumn] = player;

		let jumped = false;

		if (Math.abs(fromRow - toRow) % 2 == 0) {
			let removedPieceRow = (fromRow + toRow) / 2;
			let removedPieceColumn = (fromColumn + toColumn) / 2;
			let removedPiece = this.pieceAtPosition(removedPieceRow, removedPieceColumn);
			console.log('emitting checkers remove piece' );
			this.websocketService.checkersRemovePiece(removedPieceRow, removedPieceColumn,this.gameCode,this.playerNumber);

			//? update the board
			this.board[removedPieceRow][removedPieceColumn] = null;
			this.pieces = this.pieces.filter(p => p != removedPiece);
			removedPiece.destroy();
			jumped = true;
		}

		this.jumpingAgainH = false;

		this.clearTurnDataH();
		this.clearTurnDataC2();

		if (jumped) {
			if (this.playerNumber==1){
			this.checkPieceCanJumpH(piece);
			}
			if (this.playerNumber==2){
				this.checkPieceCanJumpC2(piece);
				}
			if (this.possibleJumpers.length) {
				this.selectPiece({ row: piece.instance.row, column: piece.instance.column })
				this.jumpingAgainH = true;
			}
			else if(this.singlePlayer==true) {
				this.turn$.next('C');
			}
		}
		else if(this.singlePlayer==true) {
			this.turn$.next('C');
		}
		if( this.singlePlayer ==false){
		
		//? Send updated board to other player
		//this.websocketService.checkersBoardMove(this.board, this.gameCode);
			if(this.jumpingAgainH == false)
			{
		console.log(this.playerNumber);
		this.websocketService.checkersTurnSE(this.playerNumber,this.gameCode)
		this.turn$.next('X');
			}
		}
	}

	moveSelectedPieceC(toRow, toColumn) {
		let piece = this.pieceAtPosition(this.selectedPieceC.instance.row, this.selectedPieceC.instance.column);
		let fromRow = piece.instance.row;
		let fromColumn = piece.instance.column;

		piece.instance.row = toRow;
		piece.instance.column = toColumn;
		piece.instance.setPosition();

		let jumped = false;

		if (Math.abs(fromRow - toRow) % 2 == 0) {
			let removedPieceRow = (fromRow + toRow) / 2;
			let removedPieceColumn = (fromColumn + toColumn) / 2;
			let removedPiece = this.pieceAtPosition(removedPieceRow, removedPieceColumn);
			this.pieces = this.pieces.filter(p => p != removedPiece);
			removedPiece.destroy();
			jumped = true;
		}

		this.selectedPieceC = piece;
		this.possibleJumpersC = [];

		setTimeout(() => {
			if (jumped) {
				this.checkPieceCanJumpC(piece);
				if (this.possibleJumpersC.length) {
					let ji = Math.floor(Math.random() * this.possibleJumpersC.length);

					setTimeout(() => {
						this.moveSelectedPieceC(this.possibleJumpersC[ji].toRow, this.possibleJumpersC[ji].toColumn);
					}, 500)

				} else {
					this.turn$.next('H'); this.turn = 'H';
				}
			} else {
				this.turn$.next('H'); this.turn = 'H';
			
			}

			this.clearTurnDataH();
			this.turn$.next('H');
			this.turn = 'H';
		}, 200)

	}

	checkPieceCanJumpC(p) {
		let row = p.instance.row;
		let column = p.instance.column;

		if (
			this.spaceExists(row + 2, column - 2) &&
			this.pieceAtPosition(row + 1, column - 1)?.instance.player == 'H' &&
			!this.pieceAtPosition(row + 2, column - 2)
		) {
			this.possibleJumpersC.push({
				fromRow: row,
				fromColumn: column,
				toRow: row + 2,
				toColumn: column - 2
			});
		}

		if (
			this.spaceExists(row + 2, column + 2) &&
			this.pieceAtPosition(row + 1, column + 1)?.instance.player == 'H' &&
			!this.pieceAtPosition(row + 2, column + 2)
		) {
			this.possibleJumpersC.push({
				fromRow: row,
				fromColumn: column,
				toRow: row + 2,
				toColumn: column + 2
			});
		}

		if (
			p.instance.isKing &&
			this.spaceExists(row - 2, column - 2) &&
			this.pieceAtPosition(row - 1, column - 1)?.instance.player == 'H' &&
			!this.pieceAtPosition(row - 2, column - 2)
		) {
			this.possibleJumpersC.push({
				fromRow: row,
				fromColumn: column,
				toRow: row - 2,
				toColumn: column - 2
			});
		}

		if (
			p.instance.isKing &&
			this.spaceExists(row - 2, column + 2) &&
			this.pieceAtPosition(row - 1, column + 1)?.instance.player == 'H' &&
			!this.pieceAtPosition(row - 2, column + 2)
		) {
			this.possibleJumpersC.push({
				fromRow: row,
				fromColumn: column,
				toRow: row - 2,
				toColumn: column + 2
			});
		}
	}

	checkPieceCanJumpH(p) {
		let row = p.instance.row;
		let column = p.instance.column;

		if (
			this.spaceExists(row - 2, column - 2) &&
			this.pieceAtPosition(row - 1, column - 1)?.instance.player == 'C' &&
			!this.pieceAtPosition(row - 2, column - 2)
		) {
			this.possibleJumpers.push({
				fromRow: row,
				fromColumn: column,
				toRow: row - 2,
				toColumn: column - 2
			});
		}

		if (
			this.spaceExists(row - 2, column + 2) &&
			this.pieceAtPosition(row - 1, column + 1)?.instance.player == 'C' &&
			!this.pieceAtPosition(row - 2, column + 2)
		) {
			this.possibleJumpers.push({
				fromRow: row,
				fromColumn: column,
				toRow: row - 2,
				toColumn: column + 2
			});
		}

		if (
			p.instance.isKing &&
			this.spaceExists(row + 2, column - 2) &&
			this.pieceAtPosition(row + 1, column - 1)?.instance.player == 'C' &&
			!this.pieceAtPosition(row + 2, column - 2)
		) {
			this.possibleJumpers.push({
				fromRow: row,
				fromColumn: column,
				toRow: row + 2,
				toColumn: column - 2
			});
		}

		if (
			p.instance.isKing &&
			this.spaceExists(row + 2, column + 2) &&
			this.pieceAtPosition(row + 1, column + 1)?.instance.player == 'C' &&
			!this.pieceAtPosition(row + 2, column + 2)
		) {
			this.possibleJumpers.push({
				fromRow: row,
				fromColumn: column,
				toRow: row + 2,
				toColumn: column + 2
			});
		}
	}

	spaceExists(row, column) {
		if (row < 0 || row > 7 || column < 0 || column > 7) return false;
		else return true;
	}

	resetWins() {
		this.store.dispatch(new winActions.resetWins());
	}


}


