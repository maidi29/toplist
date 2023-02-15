import {Component, Input} from '@angular/core';
import {addQuestionsToAllQuestions, setNewRound, setNumberRounds, State} from "../../../reducers/reducers";
import {Store} from "@ngrx/store";
import {SocketService} from "../../../services/socket.service";
import {Player} from "../../../model/player.model";
import {shuffleArray} from "../../../util";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Question} from "../../../constants/QUESTIONS";

@Component({
  selector: 'app-before-start-master',
  templateUrl: './before-start-master.component.html',
  styleUrls: ['./before-start-master.component.scss']
})
export class BeforeStartMasterComponent {
  @Input() roomId?: string;

  public players?: Player[];
  public allQuestions?: Question[];
  public openPredefinedModal = false;
  public questionsToDefine = 1;

  public questionModeForm = new FormGroup({
    questionMode: new FormControl('default', [Validators.required]),
    numberRuns: new FormControl('3', [Validators.required]),
  });

  constructor(private store: Store<State>, private socketService: SocketService) {
    store.select("players").subscribe((players) => {
      this.players = players;
    });
    store.select("allQuestions").subscribe((allQuestions) => {
      this.allQuestions = allQuestions;
    });
  }

  ngOnInit() {
    this.questionModeForm.controls.questionMode.registerOnChange(()=> {
      if(this.questionModeForm.controls.questionMode.value === 'default') {
        this.questionModeForm.controls.numberRuns.addValidators(Validators.required);
      } else {
        this.questionModeForm.controls.numberRuns.removeValidators(Validators.required);
      }
    })
  }

  public startNewRound() {
    const newRound = {
      values: shuffleArray(this.players?.map(({name}) => name) || [])
    };
    this.store.dispatch(setNewRound({nRound: newRound}));
    this.socketService.setRound(newRound);
    if(this.players && this.questionModeForm.controls.numberRuns.value) {
      const numberRuns: number = parseInt(this.questionModeForm.controls.numberRuns.value,10);
      const number = numberRuns * this.players.length;
      this.store.dispatch(setNumberRounds({number}));
      this.socketService.setNumberRounds(number);
    }
  }

  public addQuestion(question: Question) {
    this.store.dispatch(addQuestionsToAllQuestions({questions: [question]}));
  }

}
