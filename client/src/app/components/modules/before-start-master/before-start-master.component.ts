import {Component, Input} from '@angular/core';
import {replaceAnswers, setAllQuestions, setNewRound, setNumberRounds, State} from "../../../reducers/reducers";
import {Store} from "@ngrx/store";
import {SocketService} from "../../../services/socket.service";
import {Player} from "../../../model/player.model";
import {shuffleArray} from "../../../util";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Question} from "../../../constants/QUESTIONS";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Answer} from "../../../model/round.model";
@Component({
  selector: 'app-before-start-master',
  templateUrl: './before-start-master.component.html',
  styleUrls: ['./before-start-master.component.scss']
})
export class BeforeStartMasterComponent {
  @Input() roomId?: string;

  @Input() players?: Player[];
  @Input() allQuestions?: Question[];
  public openPredefinedModal = false;

  public errorNumberRuns = "";
  public errorQuestions = ""

  public questionModeForm = new FormGroup({
    questionMode: new FormControl('default', [Validators.required]),
    numberRuns: new FormControl('3', [Validators.required, Validators.min(1)]),
  });

  constructor(private store: Store<State>, private socketService: SocketService) {
  }

  ngOnInit() {
    this.questionModeForm.controls.questionMode.registerOnChange(()=> {
      this.errorNumberRuns = '';
      this.errorQuestions = '';
      if(this.questionModeForm.controls.questionMode.value === 'predefined') {
        this.questionModeForm.controls.numberRuns.removeValidators([Validators.required, Validators.min(1)]);
      } else {
        this.questionModeForm.controls.numberRuns.addValidators([Validators.required, Validators.min(1)]);
      }
    });
    this.questionModeForm.controls.numberRuns.registerOnChange(()=> {
      this.errorNumberRuns = '';
    })
  }

  public startNewRound() {
    let isValid = false;
    let isDefault = true;
    if(this.questionModeForm.controls.questionMode.value === 'predefined') {
      if((this.allQuestions?.length || 0) > 0) {
        isValid = true;
        isDefault = false;
      } else {
        this.errorQuestions = '⚠ Please define at least one topic or choose default mode.'
      }
    } else {
      if(this.questionModeForm.valid) {
        isValid = true;
      } else {
        this.errorNumberRuns = '⚠ Please define the number of runs.'
      }
    }
    if(isValid) {
      const newRound = {
        values: shuffleArray(this.players?.map(({name}) => name) || []),
        ...(!isDefault && this.allQuestions && (this.allQuestions?.length || 0) > 0 && { question: this.allQuestions[0]})
      };
      this.store.dispatch(setNewRound({nRound: newRound}));
      this.socketService.setRound(newRound);
      if (this.players && this.questionModeForm.controls.numberRuns.value && isDefault) {
        const number = this.getNumberRounds();
        this.store.dispatch(setNumberRounds({number}));
        this.socketService.setNumberRounds(number);
        this.store.dispatch(setAllQuestions({questions: []}));
      } else if (!isDefault && this.allQuestions) {
        this.socketService.setAllQuestions(this.allQuestions);
        this.store.dispatch(setNumberRounds({number: this.allQuestions.length}));
        this.socketService.setNumberRounds(this.allQuestions.length);
      }
    }
  }

  public getNumberRounds(): number {
    if(this.players && this.questionModeForm.controls.numberRuns.value) {
      const numberRuns: number = parseInt(this.questionModeForm.controls.numberRuns.value, 10);
      return numberRuns * this.players.length;
    } else {
      return 0;
    }
  }
}
