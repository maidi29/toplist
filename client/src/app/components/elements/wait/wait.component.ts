import {Component} from '@angular/core';
import {AnimationOptions} from "ngx-lottie";

@Component({
  selector: 'app-wait',
  templateUrl: './wait.component.html',
  styleUrls: ['./wait.component.scss']
})
export class WaitComponent {
  public options: AnimationOptions = {
    path: '/assets/lotties/wait.json',
  };
}
