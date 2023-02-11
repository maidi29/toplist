import {Component, OnDestroy, OnInit} from '@angular/core';
import {Answer, Round} from "../../../model/round.model";
import {Store} from "@ngrx/store";
import {addAnswer, changeScore, State} from "../../../reducers/reducers";
import {SocketService} from "../../../services/socket.service";
import {Player} from "../../../model/player.model";
import {Subscription} from "rxjs";

enum ViewState { noQuestion, thinkOfAnswer, waitForOthers, reveal, sorting, points}

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss']
})
export class PlayerViewComponent implements OnInit, OnDestroy {
  public ViewState = ViewState;
  public activeRound?: Round;
  public players?: Player[];
  public ownPlayer?: Player;
  public sent = false;
  public master = "Master";
  public state: ViewState = ViewState.noQuestion;
  public myValue?: number;
  public answers?: Answer[];
  private submitSubscription: Subscription = new Subscription();

  constructor(private store: Store<State>, private socketService: SocketService) {
    store.select("activeRound").subscribe((activeRound) => {
      if(this.activeRound?.index !== activeRound?.index) {
        // reset on new round
        this.sent = false;
        this.myValue = undefined;
      }
      if(!this.myValue && this.activeRound?.values && this.activeRound?.values.length > 0) {
        this.myValue = (activeRound?.values?.findIndex(name => name===this.ownPlayer?.name) || 0) + 1;
      }
      const notAllHaveAnswered = this.players && activeRound?.answers && activeRound.answers.length < this.players.length;
      const allAnswersFlipped = activeRound?.flippedAnswers?.size === this.players?.length;
      if(!activeRound?.question) {
        this.state = ViewState.noQuestion;
      } else if(activeRound?.question && !this.sent) {
        this.state = ViewState.thinkOfAnswer;
      } else if(activeRound?.answers && this.sent && notAllHaveAnswered) {
        this.state = ViewState.waitForOthers;
      } else if(!allAnswersFlipped) {
        this.state = ViewState.reveal;
      } else if (allAnswersFlipped) {
        this.state = ViewState.sorting;
      }
      if(allAnswersFlipped && activeRound?.answers) {
        // mutate original array for transition
        this.answers?.sort((a, b) => (activeRound.answers?.map(item => item.playerName).indexOf(a.playerName) || 0) -
            (activeRound.answers?.map(item => item.playerName).indexOf(b.playerName) || 1));
      } else {
        this.answers = [...activeRound?.answers || []];
      }
      this.activeRound = activeRound;
    });
    store.select("players").subscribe((players) => {
      this.players = players;
      this.ownPlayer = players.find(({isSelf}) => !!isSelf);
      this.master = players.find(({isMaster})=>isMaster)?.name || "Master";
    });
  }

  ngOnInit() {
    this.submitSubscription = this.socketService.onSubmitSorting().subscribe(()=> {
      this.state = ViewState.points;
      this.answers?.forEach((answer, index) => {
        if((answer.value === index+1) && (answer.playerName !== this.master)) {
          this.store.dispatch(changeScore({name: answer.playerName, value: 1}));
          this.store.dispatch(changeScore({name: this.master, value: 1}));
        }
      })
    });
  }

  ngOnDestroy() {
    this.submitSubscription.unsubscribe()
  }

  public sendAnswer(text: string) {
    if (this.ownPlayer) {
      this.sent = true;
      const answer = {playerName: this.ownPlayer.name, text, value: this.myValue || 0 }
      this.store.dispatch(addAnswer({answer}));
      this.socketService.sendAnswer(answer);
    }
  }

}
