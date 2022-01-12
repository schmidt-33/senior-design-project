import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from "rxjs";

@Injectable()
export class MockWebsocketService {
	public emitWebsocketEvent(eventName: String, eventBody: Object): boolean {
		return true;
	}

	public observeWebsocketEvent(eventName: String): Observable<Object> {
		return observableOf(Object)
	}
}
