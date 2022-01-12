import { Injectable } from '@angular/core';
import { WebsocketService } from 'src/app/shared/services/websocket/websocket.service';

const GET_WORD_LISTS = 'get-word-lists';

@Injectable({
  providedIn: 'root'
})
export class WordListService {

  constructor(
    private websocketService: WebsocketService
  ) { }

  getWordListNames() {
    this.websocketService.emitWebsocketEvent(GET_WORD_LISTS, {});
    return this.websocketService.observeWebsocketEvent(GET_WORD_LISTS);
  }
}
