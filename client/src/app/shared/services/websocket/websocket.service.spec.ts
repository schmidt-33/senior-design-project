import { TestBed } from '@angular/core/testing';

import { MockWebsocketService } from './mock-websocket.service';

describe('WebsocketServiceService', () => {
	//? Use a mock of the websocket service
	let service: MockWebsocketService;
	let eventName: String
	let eventBody: Object
	
	describe(`When sending a websocket event`, () => {
		beforeEach(() => {
			service = new MockWebsocketService();
			eventName = `mock-event-name`;
			eventBody = { sample: "body" };
		});

		it(`Should return true`, () => {
			const status = service.emitWebsocketEvent(eventName, eventBody);
			expect(status).toEqual(true);
		});
	});

	describe(`When listening to a websocket event`, () => {
		beforeEach(() => {
			service = new MockWebsocketService();
			eventName = `mock-event-name`;
		});

		it(`Should return an Object`, () => {
			service.observeWebsocketEvent(eventName).subscribe(data => {
				expect(data).toEqual(Object);
			});
		});
	});
});