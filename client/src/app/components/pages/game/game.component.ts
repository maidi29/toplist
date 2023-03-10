import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {
  addAnswer,
  addPlayers, flipAnswer, removePlayer,
  setNewRound, setNumberRounds,
  setQuestion,
  State, updateMaster, replaceAnswers, setAllQuestions
} from "../../../reducers/reducers";
import {Observable, Subscription} from "rxjs";
import {Player} from "../../../model/player.model";
import {Router} from "@angular/router";
import {SocketService} from "../../../services/socket.service";
import {Round} from "../../../model/round.model";
import {ROUTES} from "../../../app-routing.module";
import {Question} from "../../../constants/QUESTIONS";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  public roomId?: string;
  public activeRound?: Round;
  public activeRound$: Observable<Round | undefined>;
  public ownPlayer?: Player;
  public master: string = "Captain";
  public players?: Player[];
  public numberRounds?: number;
  public  allQuestions?: Question[];

  private subscriptions: Subscription[] = [];

  constructor(private store: Store<State>,
              private router: Router,
              private socketService: SocketService) {
    this.activeRound$ = store.select('activeRound');
    store.select("numberRounds").subscribe((number) => {
      this.numberRounds = number;
    });
    store.select("allQuestions").subscribe((allQuestions) => {
      this.allQuestions = allQuestions;
    });
    store.select("players").subscribe((players) => {
      this.players = players;
      this.ownPlayer = players.find(({isSelf}) => !!isSelf);
      this.master = players.find(({isMaster})=>isMaster)?.name || "Master";
    });
    store.select("activeRound").subscribe((activeRound) => {
      if(activeRound?.index && this.numberRounds && activeRound.index > this.numberRounds) {
        this.router.navigate([ROUTES.RESULTS]);
      }
      this.activeRound = activeRound;
    });
    store.select("room").subscribe((room) => {
      this.roomId = room;
    });
  }

  ngOnInit(): void {
    if(!this.roomId) this.router.navigate([ROUTES.START]);
    const sub1 = this.socketService.onSetRound().subscribe((nRound)=> this.store.dispatch(setNewRound({nRound})));
    const sub2 = this.socketService.onPlayerJoin().subscribe((player)=> this.store.dispatch(addPlayers({nPlayer: [player]})));
    const sub3 = this.socketService.onSendAnswer().subscribe((answer)=> this.store.dispatch(addAnswer({answer})));
    const sub4 = this.socketService.onSetListTopic().subscribe((question)=> this.store.dispatch(setQuestion({question})));
    const sub5 = this.socketService.onFlipAnswer().subscribe((playerName)=> this.store.dispatch(flipAnswer({playerName})));

    const sub7 = this.socketService.onUpdateMaster().subscribe((name) => this.store.dispatch(updateMaster({name})));
    const sub8 = this.socketService.onPlayerLeft().subscribe((name) => this.store.dispatch(removePlayer({name})));
    const sub9 = this.socketService.onSetNumberRounds().subscribe((number) => this.store.dispatch(setNumberRounds({number})));
    const sub10 = this.socketService.onChangeSorting().subscribe((answers) => this.store.dispatch(replaceAnswers({answers})));
    const sub11 = this.socketService.onSetAllQuestions().subscribe((questions) => this.store.dispatch(setAllQuestions({questions})));
    this.subscriptions.push(sub1,sub2,sub3,sub4,sub5,sub7,sub8,sub9,sub10,sub11);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }
}
