import { Injectable } from '@angular/core';
import {Socket} from "ngx-socket-io";
import {Player} from "../model/player.model";
import {Observable} from "rxjs";
import {Answer, Round} from "../model/round.model";
import {SOCKET_EVENTS} from "../../../../shared/socketEvents";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) {}

    createRoom(player: Player) {
      this.socket.emit(SOCKET_EVENTS.CREATE_ROOM, player)
    }

    onCreateRoom(): Observable<string> {
      return this.socket.fromEvent(SOCKET_EVENTS.CREATE_ROOM);
    }

    joinRoom(player: Player, roomId: string) {
      this.socket.emit(SOCKET_EVENTS.JOIN_ROOM, {player, roomId})
    }

    onJoinRoom(): Observable<{players: Player[], roomId: string}> {
      return this.socket.fromEvent(SOCKET_EVENTS.JOIN_ROOM);
    }

    onPlayerJoin(): Observable<Player> {
      return this.socket.fromEvent(SOCKET_EVENTS.PLAYER_JOIN);
    }

    setRound(round: Round) {
      this.socket.emit(SOCKET_EVENTS.SET_ROUND, {round});
    }

    onSetRound(): Observable<Round> {
      return this.socket.fromEvent(SOCKET_EVENTS.SET_ROUND);
    }

    setListTopic(question: string) {
      this.socket.emit(SOCKET_EVENTS.SET_LIST_TOPIC, { question});
    }

    onSetListTopic(): Observable<string> {
      return this.socket.fromEvent(SOCKET_EVENTS.SET_LIST_TOPIC);
    }

    onJoinRoomError(): Observable<{ error: string, controlName: string }> {
      return this.socket.fromEvent(SOCKET_EVENTS.JOIN_ROOM_ERROR);
    }

    sendAnswer(answer: Answer): void {
      this.socket.emit(SOCKET_EVENTS.SEND_ANSWER, answer);
    }

    onSendAnswer(): Observable<Answer> {
      return this.socket.fromEvent(SOCKET_EVENTS.SEND_ANSWER);
    }

    flipAnswer(name: string): void {
      this.socket.emit(SOCKET_EVENTS.FLIP_ANSWER, name);
    }

    onFlipAnswer(): Observable<string> {
      return this.socket.fromEvent(SOCKET_EVENTS.FLIP_ANSWER);
    }

    submitSorting(name: string): void {
      this.socket.emit(SOCKET_EVENTS.SUBMIT_SORTING, name);
    }

    onSubmitSorting(): Observable<string> {
      return this.socket.fromEvent(SOCKET_EVENTS.SUBMIT_SORTING);
    }

    updateMaster(name: string): void {
      this.socket.emit(SOCKET_EVENTS.UPDATE_MASTER, name);
    }

    onUpdateMaster(): Observable<string> {
      return this.socket.fromEvent(SOCKET_EVENTS.UPDATE_MASTER);
    }

    onPlayerLeft(): Observable<string> {
        return this.socket.fromEvent(SOCKET_EVENTS.PLAYER_LEFT);
    }

  setNumberRounds(number: number): void {
    this.socket.emit(SOCKET_EVENTS.SET_NUMBER_ROUNDS, number);
  }

  onSetNumberRounds(): Observable<number> {
    return this.socket.fromEvent(SOCKET_EVENTS.SET_NUMBER_ROUNDS);
  }
}
