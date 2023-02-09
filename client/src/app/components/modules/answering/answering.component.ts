import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Answer} from "../../../model/round.model";
import {Question} from "../../../constants/QUESTIONS";

@Component({
  selector: 'app-answering',
  templateUrl: './answering.component.html',
  styleUrls: ['./answering.component.scss']
})
export class AnsweringComponent implements OnInit {
  @Input() myValue?: number;
  @Input() maxValue?: number;
  @Input() question?: Question;
  @Output() sendText: EventEmitter<string> = new EventEmitter<string>();
  public text: string = "";

  constructor() { }

  ngOnInit(): void {
  }

  public sendAnswer() {
    this.sendText.emit(this.text);
  }

}
