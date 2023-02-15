import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Question} from "../../../constants/QUESTIONS";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-own-question-form',
  templateUrl: './own-question-form.component.html',
  styleUrls: ['./own-question-form.component.scss']
})
export class OwnQuestionFormComponent {
  @Input() playersCount?: number = 1;
  @Output() validSumbit: EventEmitter<Question> = new EventEmitter<Question>();

  public setQuestionForm = new FormGroup({
    questionText: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    from: new FormControl('Worst', [Validators.required, Validators.maxLength(80)]),
    to: new FormControl('Best', [Validators.required, Validators.maxLength(80)]),
  })

  public setQuestion(text: string, from: string, to: string) {
      this.setQuestionForm.markAllAsTouched();
    if(this.setQuestionForm.valid) {
      const question =  {
        text: text.trim(),
        from: from.trim(),
        to: to.trim()
      };
      this.validSumbit.emit(question);
    }
  }


}
