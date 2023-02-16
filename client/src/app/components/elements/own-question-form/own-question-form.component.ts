import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Question} from "../../../constants/QUESTIONS";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-own-question-form',
  templateUrl: './own-question-form.component.html',
  styleUrls: ['./own-question-form.component.scss']
})
export class OwnQuestionFormComponent implements OnChanges {
  @Input() playersCount?: number = 1;
  @Input() prefillQuestion?: string = '';
  @Input() prefillFrom?: string = 'Worst';
  @Input() prefillTo?: string = 'Best';
  @Output() validSumbit: EventEmitter<Question> = new EventEmitter<Question>();

  public setQuestionForm = new FormGroup({
    questionText: new FormControl(this.prefillQuestion, [Validators.required, Validators.maxLength(200)]),
    from: new FormControl(this.prefillFrom, [Validators.required, Validators.maxLength(80)]),
    to: new FormControl(this.prefillTo, [Validators.required, Validators.maxLength(80)]),
  })

  ngOnChanges(changes: SimpleChanges) {
    this.setQuestionForm.controls.questionText.setValue(this.prefillQuestion);
    this.setQuestionForm.controls.from.setValue(this.prefillFrom);
    this.setQuestionForm.controls.to.setValue(this.prefillTo);
  }

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
