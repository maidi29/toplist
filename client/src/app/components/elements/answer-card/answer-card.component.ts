import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-answer-card',
  templateUrl: './answer-card.component.html',
  styleUrls: ['./answer-card.component.scss']
})
export class AnswerCardComponent {
  @Input() clickable: boolean = false;
  @Input() hidden: boolean = false;
  @Input() correct: boolean = false;
  @Input() disableAnimation: boolean = false;
  @Input() playerName: string = "";
  @Input() value?: number;
  @Input() text: string = "";
}
