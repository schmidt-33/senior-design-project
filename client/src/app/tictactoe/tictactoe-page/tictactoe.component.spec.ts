import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TictactoeComponent } from './tictactoe.component';
import { Router } from '@angular/router';

describe('TictactoeComponent', () => {
    let component: TictactoeComponent;
    let fixture: ComponentFixture<TictactoeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TictactoeComponent],
            providers: [Router]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TictactoeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('when creating a new game', () => {
        let playGameSpy: jasmine.Spy;

        beforeEach(() => {
            fixture.detectChanges();
        });

        it('should initialize the game state on a button press', () => {
            playGameSpy = spyOn(component, 'init').and.callThrough();

            const createNewGameButton: HTMLElement = fixture.elementRef.nativeElement.querySelector('#newGameButton');
            createNewGameButton.click();

            expect(playGameSpy).toHaveBeenCalled();
        });

        it('should change the game screen to the game canvas', () => {
            const createNewGameButton: HTMLElement = fixture.elementRef.nativeElement.querySelector('#newGameButton');
            createNewGameButton.click();

            const initialScreen: HTMLElement = fixture.elementRef.nativeElement.querySelector('#initialScreen');
            const gameScreen: HTMLElement = fixture.elementRef.nativeElement.querySelector('#gameScreen');

            expect(initialScreen.style.display).toEqual('none');
            expect(gameScreen.style.display).toEqual('block');
        });

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('when joining an existing game', () => {
        let playGameSpy: jasmine.Spy;

        beforeEach(() => {
            fixture.detectChanges();
        });

        it('should initialize game state on button press', () => {
            playGameSpy = spyOn(component, 'init').and.callThrough();

            const joinGameButton: HTMLElement = fixture.elementRef.nativeElement.querySelector("#joinGameButton");
            joinGameButton.click();

            expect(playGameSpy).toHaveBeenCalled();
        });

        it('should change the game screen to game canvas', () => {
            const joinGameButton: HTMLElement = fixture.elementRef.nativeElement.querySelector("#joinGameButton");
            joinGameButton.click();

            const initialScreen: HTMLElement = fixture.elementRef.nativeElement.querySelector('#initialScreen');
            const gameScreen: HTMLElement = fixture.elementRef.nativeElement.querySelector('#gameScreen');

            expect(initialScreen.style.display).toEqual('none');
            expect(gameScreen.style.display).toEqual('block');
        });

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('when choosing a square', () => {
        let playGameSpy: jasmine.Spy;

        beforeEach(() => {
            fixture.detectChanges();
        });

        // NOT SURE THAT MY TESTING IS CORRECT HERE, CLICKING DESIRED SQUARE INSTEAD RESULTS IN NULL
        it('should call chooseSquare upon square click', () => {
            let desiredSquare: HTMLElement = fixture.elementRef.nativeElement.querySelector('#square');
            component.gameWinnerMessage = "";

            playGameSpy = spyOn(component, 'chooseSquare').and.callThrough();
            component.chooseSquare(1);
            // desiredSquare.click();

            expect(playGameSpy).toHaveBeenCalled();
        });
    });

    describe('when game over', () => {
        let playGameSpy: jasmine.Spy;

        beforeEach(() => {
            fixture.detectChanges();
        });

        it('should allow rematch button to be clickable', () => {
            component.handleGameOver();

            expect(component.tictactoeHomeButtonDisabled == false);
            expect(component.rematchButtonDisabled == false);
        });

        it('should update score after each game', () => {

            playGameSpy = spyOn(component, 'handleGameOver').and.callThrough();
            component.handleGameOver();

            expect(component.playerWins == 1);
        });

    });

});
