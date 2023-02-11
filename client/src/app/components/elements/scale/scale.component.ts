import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-scale',
  templateUrl: './scale.component.html',
  styleUrls: ['./scale.component.scss']
})
export class ScaleComponent {
  @Input() from: string = "";
  @Input() to: string = "";
}
