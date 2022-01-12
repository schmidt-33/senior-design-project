import { Injectable } from '@angular/core';
import { WebsocketService } from 'src/app/shared/services/websocket/websocket.service';
import { Player } from 'src/app/shared/types/player';
import { v4 as uuidv4 } from 'uuid';
import * as events from '../../../../../pictionary/events';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(
    private websocketService: WebsocketService
  ) { }

  getOnlineCount() {
    this.websocketService.emitWebsocketEvent(events.ONLINE_COUNT_EVENT, {});
    return this.websocketService.observeWebsocketEvent(events.ONLINE_COUNT_EVENT);
  }

  getWordListNames() {
    this.websocketService.emitWebsocketEvent(events.GET_WORD_LISTS, {});
    return this.websocketService.observeWebsocketEvent(events.GET_WORD_LISTS);
  }

  createPlayer(playerName: string, isVIP: boolean = false): Player {
    return { id: uuidv4(), name: playerName, isVIP };
  }

  createGame(vip: Player, wordListName: string) {
    this.websocketService.emitWebsocketEvent(events.NEW_GAME_EVENT, { vip, wordListName });
    return this.websocketService.observeWebsocketEvent(events.GAME_CREATED_EVENT);
  }

  joinGame(gameCode: string, player: Player) {
    this.websocketService.emitWebsocketEvent(events.JOIN_GAME_EVENT, { gameCode, player });
    return this.websocketService.observeWebsocketEvent(events.GAME_JOINED_EVENT);
  }

  leaveGame(gameCode: string, player: Player) {
    this.websocketService.emitWebsocketEvent(events.LEAVE_GAME_EVENT, { gameCode, player });
    return this.websocketService.observeWebsocketEvent(events.GAME_LEFT_EVENT);
  }

  startGame(gameCode: string) {
    this.websocketService.emitWebsocketEvent(events.START_GAME_EVENT, { gameCode });
    return this.websocketService.observeWebsocketEvent(events.GAME_STARTED_EVENT);
  }

  stopGame(gameCode: string) {
    this.websocketService.emitWebsocketEvent(events.STOP_GAME_EVENT, { gameCode });
    return this.websocketService.observeWebsocketEvent(events.STOP_GAME_EVENT);
  }

  restartGame(gameCode: string) {
    this.websocketService.emitWebsocketEvent(events.RESTART_GAME_EVENT, { gameCode });
    return this.websocketService.observeWebsocketEvent(events.RESTART_GAME_EVENT);
  }

  getGameStatus() {
    return this.websocketService.observeWebsocketEvent(events.GAME_STATUS_EVENT);
  }

  initializeRound(gameCode: string) {
    this.websocketService.emitWebsocketEvent(events.INITIALIZE_ROUND_EVENT, { gameCode });
    return this.websocketService.observeWebsocketEvent(events.ROUND_INITIALIZED_EVENT);
  }

  startRound(gameCode: string, roundWord: string) {
    this.websocketService.emitWebsocketEvent(events.START_ROUND_EVENT, { gameCode, roundWord });
    return this.websocketService.observeWebsocketEvent(events.ROUND_STARTED_EVENT);
  }

  getRoundWords(gameCode: string) {
    this.websocketService.emitWebsocketEvent(events.GET_ROUND_WORDS_EVENT, { gameCode });
    return this.websocketService.observeWebsocketEvent(events.GET_ROUND_WORDS_EVENT);
  }

  getOnlinePlayerCount() {
    return this.websocketService.observeWebsocketEvent(events.UPDATE_ONLINE_PLAYER_COUNT_EVENT);
  }

  getPlayers(gameCode: string) {
    return this.websocketService.observeWebsocketEvent(events.PLAYERS_CHANGED_EVENT);
  }

  getGuesses(gameCode: string) {
    return this.websocketService.observeWebsocketEvent(events.GUESS_SUBMITTED_EVENT);
  }

  submitGuess(gameCode: string, player: Player, guess: string) {
    this.websocketService.emitWebsocketEvent(events.SUBMIT_GUESS_EVENT, { gameCode, player, guess });
    return this.websocketService.observeWebsocketEvent(events.SUBMIT_GUESS_EVENT);
  }

  getCanvas(gameCode: string) {
    return this.websocketService.observeWebsocketEvent(events.CANVAS_UPDATED);
  }

  canvasUpdated(gameCode: string, canvas: any) {
    return this.websocketService.emitWebsocketEvent(events.CANVAS_UPDATED, { gameCode, canvas })
  }
}
