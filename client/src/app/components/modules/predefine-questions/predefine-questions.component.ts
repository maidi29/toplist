import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Question} from "../../../constants/QUESTIONS";
import {setAllQuestions, State} from "../../../reducers/reducers";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Store} from "@ngrx/store";
import {fadeIn} from "../../../util/animations";

interface UnsubmittedQuestion extends Question{
  open: boolean
}

const DEFAULT_QUESTION: UnsubmittedQuestion = {
  text: '',
  from: 'Worst',
  to: 'Best',
  open: true
}
@Component({
  selector: 'app-predefine-questions',
  templateUrl: './predefine-questions.component.html',
  styleUrls: ['./predefine-questions.component.scss'],
  animations: [fadeIn]
})
export class PredefineQuestionsComponent implements OnInit{
  @Input() playersCount = 1;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  public allQuestionsUnsubmitted: UnsubmittedQuestion[] = [];
  @Input() allQuestions?: Question[] = [];

  constructor(private store: Store<State>) {
  }

  ngOnInit() {
    if(this.allQuestions && this.allQuestions.length > 0) {
      this.allQuestionsUnsubmitted = [...this.allQuestions.map((quest) =>
        ({...quest, open: false}))];
    }
    this.allQuestionsUnsubmitted.push({...DEFAULT_QUESTION});
  }


  public addQuestions() {
    const toAdd: Question[] = this.allQuestionsUnsubmitted.filter(({open})=>!open).map(
      ({text, from, to})=>({text, from, to}));
    this.store.dispatch(setAllQuestions({questions: toAdd}));
  }

  public removeQuestion(index: number) {
    if(this.allQuestionsUnsubmitted.length <= 1) {
      this.addQuestionForm();
    }
    this.allQuestionsUnsubmitted = this.allQuestionsUnsubmitted.filter((q, i)=> i !== index);
  }

  public addQuestionForm() {
    this.allQuestionsUnsubmitted.push({...DEFAULT_QUESTION});
  }

  public drop(event: CdkDragDrop<UnsubmittedQuestion[]>) {
    moveItemInArray(this.allQuestionsUnsubmitted, event.previousIndex, event.currentIndex);
  }

  onSave(question: Question, index: number) {
    this.allQuestionsUnsubmitted[index].text = question.text;
    this.allQuestionsUnsubmitted[index].from= question.from;
    this.allQuestionsUnsubmitted[index].to= question.to;
    this.allQuestionsUnsubmitted[index].open = false;
  }

}
