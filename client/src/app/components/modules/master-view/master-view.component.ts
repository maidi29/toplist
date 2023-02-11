import { Component } from '@angular/core';
import {
  setNewRound,
  State,
  updateMaster,
  addAnswer, changeScore
} from "../../../reducers/reducers";
import {Store} from "@ngrx/store";
import {SocketService} from "../../../services/socket.service";
import {Round} from "../../../model/round.model";
import {Player} from "../../../model/player.model";
import {shuffleArray} from "../../../util";

export enum MasterViewState { setQuestion, thinkOfAnswer, waitForOthers, answersReveal, sorting, points}

@Component({
  selector: 'app-master-view',
  templateUrl: './master-view.component.html',
  styleUrls: ['./master-view.component.scss']
})
export class MasterViewComponent {
  public ViewState = MasterViewState;
  public activeRound?: Round;
  public players?: Player[];
  public numberRounds?: number;
  public state: MasterViewState = MasterViewState.setQuestion;
  public sent = false;
  public ownPlayer?: Player;
  public myValue?: number;

  constructor(private store: Store<State>, private socketService: SocketService) {
    store.select("numberRounds").subscribe((number) => {
      this.numberRounds = number;
    });
    store.select("players").subscribe((players) => {
      this.players = players;
      this.ownPlayer = players.find(({isSelf}) => !!isSelf);
    });
    store.select("activeRound").subscribe((activeRound) => {
      if(this.activeRound?.index !== activeRound?.index) {
        this.sent = false;
        this.myValue = undefined;
      }
      if(!this.myValue && this.activeRound?.values && this.activeRound?.values.length > 0) {
        this.myValue = (activeRound?.values?.findIndex(name => name===this.ownPlayer?.name) || 0) + 1;
      }
      this.activeRound = activeRound;
      const notAllHaveAnswered = this.players && activeRound?.answers && activeRound.answers.length < this.players.length;
      const allAnswersFlipped = activeRound?.flippedAnswers?.size === this.players?.length;
      if(!activeRound?.question) {
        this.state = MasterViewState.setQuestion;
      } else if(activeRound?.question && !this.sent) {
        this.state = MasterViewState.thinkOfAnswer;
      } else if(this.sent && notAllHaveAnswered) {
        this.state = MasterViewState.waitForOthers;
      } else if(!allAnswersFlipped) {
        this.state = MasterViewState.answersReveal;
      } else if (allAnswersFlipped) {
        this.state = MasterViewState.sorting;
      }
    });
  }

  public passToNextMaster() {
    const newRound = {
      values: shuffleArray(this.players?.map(({name}) => name) || [])
    }
    this.store.dispatch(setNewRound({nRound: newRound}));
    this.socketService.setRound(newRound);
    if(this.players) {
      const myIndex = this.players.findIndex((player) => player.isMaster);
      const newMaster = this.players[(myIndex+1) % this.players.length];
      this.store.dispatch(updateMaster({name:newMaster.name}));
      this.socketService.updateMaster(newMaster.name);
    }
  }

  public sendAnswer(text: string) {
    if (this.ownPlayer) {
      this.sent = true;
      const answer = {playerName: this.ownPlayer.name, text, flipped: false, value: this.myValue || 0 }
      this.store.dispatch(addAnswer({answer}));
      this.socketService.sendAnswer(answer);
    }
  }

  public onSubmitOrder() {
    this.state = MasterViewState.points;
    this.activeRound?.answers?.reverse().forEach((answer, index) => {
      if((answer.value === index+1) && (answer.playerName !== this.ownPlayer?.name)) {
        this.store.dispatch(changeScore({name: answer.playerName, value: 1}));
        this.store.dispatch(changeScore({name: (this.ownPlayer?.name || ''), value: 1}));
      }
    })
  }
}
