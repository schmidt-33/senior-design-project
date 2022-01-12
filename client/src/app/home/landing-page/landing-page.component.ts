import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../services/home.service';

interface gameInfo {
	gameTitle: string
	route: string
	description: string
	image: string
}

@Component({
	selector: 'app-landing-page',
	templateUrl: './landing-page.component.html',
	styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit, OnDestroy {
	onlineCount: number
	inGameCount: number

	newGames: gameInfo[] = [
		{
			gameTitle: "Snake",
			route: "/snake",
			description: "Play against another person trying to get the biggest snake",
			image:"../../../assets/home-images/snake-game.png"
		},
		{
			gameTitle: "TicTacToe",
			route: "/tictactoe",
			description: "Play against another person in a classic game of Tic Tac Toe",
			image:"../../../assets/home-images/tic-tac-toe-game.png"
		},
		{
			gameTitle: "Battleship",
			route: "/battleship",
			description: "Try to sink all of the opponents ships before they sink yours",
			image:"../../../assets/home-images/battleship-game.png"
		},
		{
			gameTitle: "Checkers",
			route: "/checkers",
			description: "Play against another player in a classic game of checkers",
			image:"../../../assets/home-images/checkers-game.png"
		},
		{
			gameTitle: "Mine Sweeper",
			route: "/minesweeper",
			description: "Play alongside another player and try to avoid all of the mines",
			image:"../../../assets/home-images/minesweeper-game.png"
		},
		{
			gameTitle: "Pong",
			route: "/pong",
			description: "Play against another player and don't let the ball get past you",
			image:"../../../assets/home-images/pong-game.png"
		},
		{
			gameTitle: "Hangman",
			route: "/hangman",
			description: "Guess the secret word before you run out of lives",
			image:"../../../assets/home-images/hangman-game.png"
		},
		{
			gameTitle: "Space Invaders",
			route: "/spaceinvaders",
			description: "Work together to clear the waves of aliens",
			image:"../../../assets/home-images/space-invaders-game.png"
		},
		{
			gameTitle: "Trivia",
			route: "/trivia",
			description: "Test your knowledge on an array of topics",
			image:"../../../assets/home-images/trivia-game.png"
		},
		{
			gameTitle: "Apples to Apples",
			route: "/applestoapples",
			description: "Win the most rounds by playing the best card to fit the phrase",
			image:"../../../assets/home-images/apples-to-apples-game.jpg"
		},
	]
	

	constructor(
		private homeService: HomeService,
		private route: ActivatedRoute
	) {
		this.onlineCount = 1;
		this.inGameCount = 0;

		route.params.subscribe(val => {
			//? Requests an updated online count when the home page is activated
			this.homeService.requestOnlineCount();
		})
	}

	ngOnInit(): void {
		this.homeService.reconnectHomeWebsocket();
		this.onlineCountHandler();
	}

	@HostListener('window:beforeunload')
	async ngOnDestroy() {
		await this.homeService.disconnectHomeWebsocket();
		console.log(`Home websocket disconnected`);
	}

	onlineCountHandler() {
		this.homeService.listenForOnlineCount()
			.subscribe(data => {
				this.onlineCount = parseInt(data['count']) || 0;
			});
	}
}
