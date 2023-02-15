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
  public error?: string;

  constructor() { }

  ngOnInit(): void {
  }

  public sendAnswer() {
    this.text = this.text.trim();
    if(this.text.length === 0) {
      this.error = "Please enter an answer"
    } else if (this.text.length > 250) {
      this.error = "Please enter a maximum of 250 characters"
    }
    if(!this.error) {
      this.sendText.emit(this.text.trim());
    }
  }

}
