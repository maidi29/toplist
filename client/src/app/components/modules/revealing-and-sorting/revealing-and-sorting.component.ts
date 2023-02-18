import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Answer, Round} from "../../../model/round.model";
import {flipAnswer, replaceAnswers, State} from "../../../reducers/reducers";
import {Store} from "@ngrx/store";
import {SocketService} from "../../../services/socket.service";
import {MasterViewState} from "../master-view/master-view.component";

@Component({
  selector: 'app-revealing-and-sorting',
  templateUrl: './revealing-and-sorting.component.html',
  styleUrls: ['./revealing-and-sorting.component.scss']
})
export class RevealingAndSortingComponent implements OnChanges {
  @Input() state: MasterViewState = MasterViewState.answersReveal;
  @Output() submitOrder: EventEmitter<void> = new EventEmitter<void>();
  public ViewState = MasterViewState;

  @Input() activeRound?: Round;
  public answers: Answer[] = [];

  constructor(private store: Store<State>, private socketService: SocketService) {
  }

  ngOnChanges(): void {
    if(this.activeRound?.answers) {
      this.answers = [...this.activeRound?.answers];
    }
  }

  public drop(event: CdkDragDrop<Answer[]>) {
    moveItemInArray(this.answers, event.previousIndex, event.currentIndex);
    this.store.dispatch(replaceAnswers({answers: this.answers}))
    this.socketService.changeSorting(this.answers);
  }

  public flipCard(playerName: string) {
    if(this.state === MasterViewState.answersReveal) {
      this.store.dispatch(flipAnswer({playerName}));
      this.socketService.flipAnswer(playerName);
    }
  }

  public submit() {
      this.socketService.submitSorting();
      this.submitOrder.emit();
  }

  public isHidden(answer: Answer): boolean {
    return !this.activeRound?.flippedAnswers?.has(answer.playerName)
  }

}
