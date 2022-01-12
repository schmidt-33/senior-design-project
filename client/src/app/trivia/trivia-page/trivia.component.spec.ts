import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsocketService } from 'src/app/shared/services/websocket/websocket.service';
import { TriviaComponent } from './trivia.component';
import { TriviaService } from '../services/trivia.service';
import { Observable, from } from 'rxjs';

describe('TriviaComponent', () => {
	let component: TriviaComponent;
	let fixture: ComponentFixture<TriviaComponent>;
	let triviaService: TriviaService;
	let websocketService: WebsocketService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule],
			declarations: [TriviaComponent],
			providers: [TriviaService, WebsocketService]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TriviaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	describe('when creating a new game', () => {
		let playGameSpy: jasmine.Spy;

		beforeEach(() => {
			websocketService = new WebsocketService();
			triviaService = new TriviaService(websocketService);
			fixture.detectChanges();
		});

		it('should initialize the game state on a button press', () => {
			playGameSpy = spyOn(component, 'newGame').and.callThrough();

			fixture.componentInstance.ngOnInit();

			const createNewGameButton: HTMLElement = fixture.elementRef.nativeElement.querySelector('#newGameButton');
			createNewGameButton.click();

			expect(playGameSpy).toHaveBeenCalled()
		});

		// it ('should change the game screen to the lobby', () => {
		// 	playGameSpy = spyOn(component, 'newGame').and.callThrough()
			
		// 	fixture.componentInstance.ngOnInit();

		// 	const initialTriviaScreen: HTMLElement = fixture.elementRef.nativeElement.querySelector('#initial-trivia-screen');
		// 	const gameScreen: HTMLElement = fixture.elementRef.nativeElement.querySelector('.game-screen');

		// 	const initialScreenDisplay: string = window.getComputedStyle(initialTriviaScreen).display;
		// 	const gameScreenDisplay: string = window.getComputedStyle(gameScreen).display;

		// 	expect(initialScreenDisplay).toEqual('none');
		// 	expect(gameScreenDisplay).toEqual('block');
		// });
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
