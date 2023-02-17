import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Question} from "../../../constants/QUESTIONS";
import {setAllQuestions, State} from "../../../reducers/reducers";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Store} from "@ngrx/store";
import {fadeIn} from "../../../util/animations";

const DEFAULT_QUESTION = {
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
export class PredefineQuestionsComponent {
  @Input() playersCount = 1;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  public allQuestionsUnsubmitted = [{...DEFAULT_QUESTION}];

  constructor(private store: Store<State>) {
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

  public drop(event: CdkDragDrop<{ text: string; from: string; to: string; open: boolean; }[]>) {
    moveItemInArray(this.allQuestionsUnsubmitted, event.previousIndex, event.currentIndex);
  }

  onSave(question: Question, index: number) {
    this.allQuestionsUnsubmitted[index].text = question.text;
    this.allQuestionsUnsubmitted[index].from= question.from;
    this.allQuestionsUnsubmitted[index].to= question.to;
    this.allQuestionsUnsubmitted[index].open = false;
    console.log(this.allQuestionsUnsubmitted);
  }

}
