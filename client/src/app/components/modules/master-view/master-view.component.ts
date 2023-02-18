import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {
  setNewRound,
  State,
  updateMaster,
  addAnswer, changeScore, setQuestion
} from "../../../reducers/reducers";
import {Store} from "@ngrx/store";
import {SocketService} from "../../../services/socket.service";
import {Round} from "../../../model/round.model";
import {Player} from "../../../model/player.model";
import {shuffleArray} from "../../../util";
import {Question} from "../../../constants/QUESTIONS";
import {Observable} from "rxjs";

export enum MasterViewState { setQuestion, thinkOfAnswer, waitForOthers, answersReveal, sorting, points}

@Component({
  selector: 'app-master-view',
  templateUrl: './master-view.component.html',
  styleUrls: ['./master-view.component.scss']
})
export class MasterViewComponent implements OnChanges {
  public ViewState = MasterViewState;
  @Input() activeRound?: Round;
  @Input() players?: Player[];
  @Input() numberRounds?: number;
  @Input() allQuestions?: Question[];
  @Input() ownPlayer?: Player;

  public state: MasterViewState = MasterViewState.setQuestion;
  public sent = false;
  public myValue?: number;

  constructor(private store: Store<State>, private socketService: SocketService) {
  }

  ngOnChanges(changes: SimpleChanges) {
      if(changes['activeRound']?.previousValue?.index !== changes['activeRound']?.currentValue?.index) {
        this.sent = false;
        this.myValue = undefined;
      }
      if (!this.myValue && this.activeRound?.values && this.activeRound?.values.length > 0) {
        this.myValue = (this.activeRound?.values?.findIndex(name => name === this.ownPlayer?.name) || 0) + 1;
      }
      const notAllHaveAnswered = this.players && this.activeRound?.answers && this.activeRound.answers.length < this.players.length;
      const allAnswersFlipped = this.activeRound?.flippedAnswers?.size === this.players?.length;
      if(!this.activeRound?.question) {
        this.state = MasterViewState.setQuestion;
      } else if(this.activeRound?.question && !this.sent) {
        this.state = MasterViewState.thinkOfAnswer;
      } else if(this.sent && notAllHaveAnswered) {
        this.state = MasterViewState.waitForOthers;
      } else if(!allAnswersFlipped) {
        this.state = MasterViewState.answersReveal;
      } else if (allAnswersFlipped) {
        this.state = MasterViewState.sorting;
      }
  }

  public passToNextMaster() {
    let newPredefinedQuestion;
    if(this.allQuestions && this.activeRound?.index && this.allQuestions.length > 0) {
      newPredefinedQuestion = this.allQuestions[this.activeRound?.index];
    }
    const newRound = {
      values: shuffleArray(this.players?.map(({name}) => name) || []),
      ...newPredefinedQuestion && {question: newPredefinedQuestion}
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
    this.activeRound?.answers?.forEach((answer, index) => {
      if((answer.value === index+1) && (answer.playerName !== this.ownPlayer?.name)) {
        this.store.dispatch(changeScore({name: answer.playerName, value: 1}));
        this.store.dispatch(changeScore({name: (this.ownPlayer?.name || ''), value: 1}));
      }
    })
  }
}
