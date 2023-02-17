import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
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
export class PlayerViewComponent implements OnInit, OnDestroy, OnChanges {
  public ViewState = ViewState;
  @Input() activeRound?: Round;
  @Input() players?: Player[];
  @Input() ownPlayer?: Player;
  public sent = false;
  @Input() master = "Captain";
  public state: ViewState = ViewState.noQuestion;
  public myValue?: number;
  public answers?: Answer[];
  private submitSubscription: Subscription = new Subscription();

  constructor(private store: Store<State>, private socketService: SocketService) {
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

  ngOnChanges(changes: SimpleChanges) {
    if(changes['activeRound'].previousValue?.index !== changes['activeRound'].currentValue?.index) {
      // reset on new round
      this.sent = false;
      this.myValue = undefined;
    }
    if(!this.myValue && this.activeRound?.values && this.activeRound?.values.length > 0) {
      this.myValue = (this.activeRound?.values?.findIndex(name => name===this.ownPlayer?.name) || 0) + 1;
    }
    const notAllHaveAnswered = this.players && this.activeRound?.answers && this.activeRound.answers.length < this.players.length;
    const allAnswersFlipped = this.activeRound?.flippedAnswers?.size === this.players?.length;
    if(!this.activeRound?.question) {
      this.state = ViewState.noQuestion;
    } else if(this.activeRound?.question && !this.sent) {
      this.state = ViewState.thinkOfAnswer;
    } else if(this.activeRound?.answers && this.sent && notAllHaveAnswered) {
      this.state = ViewState.waitForOthers;
    } else if(!allAnswersFlipped) {
      this.state = ViewState.reveal;
    } else if (allAnswersFlipped) {
      this.state = ViewState.sorting;
    }
    if(allAnswersFlipped && this.activeRound?.answers) {
      // mutate original array for transition
      this.answers?.sort((a, b) => (this.activeRound?.answers?.map(item => item.playerName).indexOf(a.playerName) || 0) -
        (this.activeRound?.answers?.map(item => item.playerName).indexOf(b.playerName) || 1));
    } else {
      this.answers = [...this.activeRound?.answers || []];
    }
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
