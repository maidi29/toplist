import {Component} from '@angular/core';
import {Round} from "../../../model/round.model";
import {Store} from "@ngrx/store";
import {addAnswer, State} from "../../../reducers/reducers";
import {SocketService} from "../../../services/socket.service";
import {Player} from "../../../model/player.model";

enum ViewState { noQuestion, thinkOfAnswer, waitForOthers, answersReveal, pointsReveal}

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss']
})
export class PlayerViewComponent {
  public ViewState = ViewState;
  public activeRound?: Round;
  public players?: Player[];
  public ownPlayer?: Player;
  public sent = false;
  public master = "Master";
  public state: ViewState = ViewState.noQuestion;
  public myValue?: number;

  constructor(private store: Store<State>, private socketService: SocketService) {
    store.select("activeRound").subscribe((activeRound) => {
      if(this.activeRound?.index !== activeRound?.index) {
        // reset on new round
        this.sent = false;
        this.myValue = (activeRound?.values?.findIndex(name => name===this.ownPlayer?.name) || 0) + 1;
      }
      const notAllHaveAnswered = this.players && activeRound?.answers && activeRound.answers.length < this.players.length;
      if(!activeRound?.question) {
        this.state = ViewState.noQuestion;
      } else if(activeRound?.question && !this.sent) {
        this.state = ViewState.thinkOfAnswer;
      } else if(activeRound?.answers && this.sent && notAllHaveAnswered) {
        this.state = ViewState.waitForOthers;
      } else if(!activeRound?.winner) {
        this.state = ViewState.answersReveal;
      } else if(activeRound?.winner) {
        this.state = ViewState.pointsReveal;
      }
      this.activeRound = activeRound;
    });
    store.select("players").subscribe((players) => {
      this.players = players;
      this.ownPlayer = players.find(({isSelf}) => !!isSelf);
      this.master = players.find(({isMaster})=>isMaster)?.name || "Master";
    });
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
