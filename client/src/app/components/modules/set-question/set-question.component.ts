import {Component, Input, OnInit} from '@angular/core';
import {generateRandom} from "../../../util/helpers";
import {Question, QUESTIONS} from "../../../constants/QUESTIONS";
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
  public questionText: string = "";
  public from: string = "Worst";
  public to: string = "Best";
  public exampleQuestions: Question[] = [];
  public errorFrom?: string;
  public errorTo?: string;
  public errorQuestion?: string;

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

  public setQuestion(text: string, from: string, to: string) {
    if(from.trim() === "") {
      this.errorFrom = "Please define a description for the lowest value"
    }
    if(from.length > 50) {
      this.errorFrom = "Please enter only 50 characters"
    }
    if(to.trim() === "") {
      this.errorFrom = "Please define a description for the highest value"
    }
    if(to.length > 50) {
      this.errorTo = "Please enter only 50 characters"
    }
    if(text.trim() === "") {
      this.errorQuestion = "Please define a question"
    }
    if(text.length > 100) {
      this.errorQuestion = "Please enter only 100 characters"
    }
    if(!this.errorQuestion && !this.errorFrom && !this.errorTo) {
      const question =  {
        text,
        from,
        to
      };
      this.store.dispatch(setQuestion({question}));
      this.socketService.setListTopic(question);
    }
  }

}
