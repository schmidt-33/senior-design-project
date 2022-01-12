import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsocketService } from 'src/app/shared/services/websocket/websocket.service';
import { ApplestoapplesComponent } from './Applestoapples.component';
import { ApplestoapplesService } from '../services/applestoapples.services';
import { Observable, from } from 'rxjs';

describe('ApplestoapplesComponent', () => {
	let component: ApplestoapplesComponent;
	let fixture: ComponentFixture<ApplestoapplesComponent>;
	let applestoapplesService: ApplestoapplesService;
	let websocketService: WebsocketService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule],
			declarations: [ApplestoapplesComponent],
			providers: [ApplestoapplesService, WebsocketService]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ApplestoapplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	describe('when creating a new game', () => {
		let playGameSpy: jasmine.Spy;

		beforeEach(() => {
			websocketService = new WebsocketService();
			applestoapplesService = new ApplestoapplesService(websocketService);
			fixture.detectChanges();
		});

		it('should initialize the game state on a button press', () => {
			playGameSpy = spyOn(component, 'init').and.callThrough();

			fixture.componentInstance.ngOnInit();

			const createNewGameButton: HTMLElement = fixture.elementRef.nativeElement.querySelector('#newGameButton');
			createNewGameButton.click();

			expect(playGameSpy).toHaveBeenCalled()
		});
		
		// it ('should change the game screen to the lobby', () => {
		// 	playGameSpy = spyOn(component, 'newGame').and.callThrough()
			
		// 	fixture.componentInstance.ngOnInit();

		// 	const initialApplestoapplesScreen: HTMLElement = fixture.elementRef.nativeElement.querySelector('#initial-Applestoapples-screen');
		// 	const gameScreen: HTMLElement = fixture.elementRef.nativeElement.querySelector('.game-screen');

		// 	const initialScreenDisplay: string = window.getComputedStyle(initialApplestoapplesScreen).display;
		// 	const gameScreenDisplay: string = window.getComputedStyle(gameScreen).display;

		// 	expect(initialScreenDisplay).toEqual('none');
		// 	expect(gameScreenDisplay).toEqual('block');
		// });
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
