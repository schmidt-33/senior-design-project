import { TestBed } from '@angular/core/testing';
import { WebsocketService } from 'src/app/shared/services/websocket/websocket.service';
import { HomeService } from './home.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

describe('HomeService', () => {
	let service: HomeService;
	let websocketService: WebsocketService;

	beforeEach(() => {
		TestBed.configureTestingModule({})
		service = TestBed.inject(HomeService);
	});

	describe('When requesting an online count', () => {
		beforeEach(() => {
			websocketService = new WebsocketService();
			service = new HomeService(websocketService);
		})

		it('should return true', () => {
			const status = service.requestOnlineCount();
			expect(status).toEqual(true);
		});
	});

	describe('When observing an online count', () => {		
		beforeEach(() => {
			websocketService = new WebsocketService();
			service = new HomeService(websocketService);
		})

		it('should return an instance of an Observable', () => {
			expect(service.listenForOnlineCount()).toBeInstanceOf(Observable)
		});
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
