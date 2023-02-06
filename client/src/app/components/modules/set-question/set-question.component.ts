import {Component, Input, OnInit} from '@angular/core';
import {generateRandom} from "../../../util/helpers";
import {QUESTIONS} from "../../../constants/QUESTIONS";
import {Store} from "@ngrx/store";
import {setQuestion, State} from "../../../reducers/reducers";
import {SocketService} from "../../../services/socket.service";

@Component({
  selector: 'app-set-question',
  templateUrl: './set-question.component.html',
  styleUrls: ['./set-question.component.scss']
})
export class SetQuestionComponent implements OnInit {
  @Input() playersCount? = 1;
  public question: string = "";
  public from: string = "worst";
  public to: string = "best";
  public exampleQuestions: string[] = [''];

  constructor(private store: Store<State>, private socketService: SocketService) {}

  ngOnInit(): void {
    this.exampleQuestions = this.getNewRandomQuestions();
  }

  public getNewRandomQuestions(): string[] {
    const s1 = generateRandom(QUESTIONS.length-1, []);
    const s2 = generateRandom( QUESTIONS.length-1, [s1]);
    const s3 = generateRandom( QUESTIONS.length-1, [s1, s2]);
    return [QUESTIONS[s1],QUESTIONS[s2],QUESTIONS[s3]];
  }

  public setQuestion(question: string) {
    this.store.dispatch(setQuestion({question}));
    this.socketService.setListTopic(question);
  }

}
