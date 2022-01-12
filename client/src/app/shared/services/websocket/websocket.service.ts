import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class WebsocketService {
	//? Make a socket instance
	private socket: any;

	constructor() {
		this.socket = (io as any)(environment.ws_url);
		console.log('socket connected');
	}

	/**
	 * Checks to see if the current socket is disconnected and attempts to reconnect it.
	 * This is generally used when changing games and routes
	 * @returns boolean
	 */
	reconnectSocket(): boolean {
		if (this.socket.connected === false) {
			this.socket.connect();
			return true;
		}
		else {
			return false;
		}
	}

	/**
	 * Emits a websocket event to the websocket server with the event name and body specified
	 * @param eventName The name of the websocket event to emit to
	 * @param eventBody The data to pass to the websocket server
	 */
	public emitWebsocketEvent(eventName: string, eventBody: Object): boolean {
		try {
			this.socket.emit(eventName, eventBody);
			return true
		}
		catch (e) {
			return false;
		}
	}

	/**
	 * Listens for a websocket event from the websocket server with the specified event name
	 * @param eventName The name of the websocket event to listen for
	 * @returns Observable<any>
	 */
	public observeWebsocketEvent(eventName: string): Observable<Object> {
		return new Observable((observer: Observer<any>) => {
			this.socket.on(eventName, (data) => {
				if (data) observer.next(data);
				else observer.error('Unable To Reach Server');
			})
			return () => {
				this.socket.disconnect();
			}
		})
	}

	/**
	 * Disconnects the current connected Websocket
	 * @returns boolean
	 */
	public disconnectWebsocketEvent(): boolean {
		try {
			console.log(`Disconnecting socket`);
			console.log(this.socket);
			this.socket.disconnect();
			return true;
		}
		catch (e) {
			return false;
		}
	}
}
