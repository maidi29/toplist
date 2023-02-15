import {Component, Input, OnInit} from '@angular/core';
import {generateRandom} from "../../../util/helpers";
import {Question, QUESTIONS} from "../../../constants/QUESTIONS";
import {Store} from "@ngrx/store";
import {setQuestion, State} from "../../../reducers/reducers";
import {SocketService} from "../../../services/socket.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-set-question',
  templateUrl: './set-question.component.html',
  styleUrls: ['./set-question.component.scss']
})
export class SetQuestionComponent implements OnInit {
  @Input() playersCount? = 1;
  public exampleQuestions: Question[] = [];

  public setQuestionForm = new FormGroup({
    questionText: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    from: new FormControl('Worst', [Validators.required, Validators.maxLength(80)]),
    to: new FormControl('Best', [Validators.required, Validators.maxLength(80)]),
  });

  constructor(private store: Store<State>, private socketService: SocketService) {}

  ngOnInit(): void {
    this.exampleQuestions = this.getNewRandomQuestions();
  }

  public getNewRandomQuestions(): Question[] {
    const s1 = generateRandom(QUESTIONS.length-1, []);
    const s2 = generateRandom( QUESTIONS.length-1, [s1]);
    const s3 = generateRandom( QUESTIONS.length-1, [s1, s2]);
    return [QUESTIONS[s1],QUESTIONS[s2],QUESTIONS[s3]];
  }

  public setQuestion(text: string, from: string, to: string, isExample: boolean) {
    if(!isExample) {
      this.setQuestionForm.markAllAsTouched();
    }
    if((!isExample && this.setQuestionForm.valid) || isExample) {
      const question =  {
        text: text.trim(),
        from: from.trim(),
        to: to.trim()
      };
      this.store.dispatch(setQuestion({question}));
      this.socketService.setListTopic(question);
    }
  }
}
