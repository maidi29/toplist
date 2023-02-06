import { Component } from '@angular/core';
import {
  changeScore,
  flipAnswer,
  setNewRound,
  State,
  updateMaster,
  submitSorting,
  addAnswer
} from "../../../reducers/reducers";
import {Store} from "@ngrx/store";
import {SocketService} from "../../../services/socket.service";
import {Round} from "../../../model/round.model";
import {Player} from "../../../model/player.model";
import {shuffleArray} from "../../../util";

enum ViewState { setQuestion, thinkOfAnswer, waitForOthers, answersReveal, winnerDisplay}

@Component({
  selector: 'app-master-view',
  templateUrl: './master-view.component.html',
  styleUrls: ['./master-view.component.scss']
})
export class MasterViewComponent {
  public ViewState = ViewState;
  public activeRound?: Round;
  public selectedWinner?: string;
  public players?: Player[];
  public numberRounds?: number;
  public state: ViewState = ViewState.setQuestion;
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
        this.myValue = (activeRound?.values?.findIndex(name => name===this.ownPlayer?.name) || 0) + 1;
        this.sent = false;
      }
      this.activeRound = activeRound;
      const notAllHaveAnswered = this.players && activeRound?.answers && activeRound.answers.length < this.players.length;
      if(!activeRound?.question) {
        this.state = ViewState.setQuestion;
      } else if(activeRound?.question && !this.sent) {
        this.state = ViewState.thinkOfAnswer;
      } else if(this.sent && notAllHaveAnswered) {
        this.state = ViewState.waitForOthers;
      } else if(!activeRound?.winner) {
        this.state = ViewState.answersReveal;
      } else if (activeRound?.winner) {
        this.state = ViewState.winnerDisplay;
      }
    });
  }

  public flipCard(playerName: string) {
    if(this.activeRound?.flippedAnswers?.has(playerName)) {
      this.selectedWinner = playerName;
    } else {
      this.store.dispatch(flipAnswer({playerName}));
      this.socketService.flipAnswer(playerName);
    }
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

}
