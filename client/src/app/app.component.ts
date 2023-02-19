import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {resetAll, State} from "./reducers/reducers";
import {Store} from "@ngrx/store";
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements  OnInit {

  private isBrowser = isPlatformBrowser(this.platformId);

  constructor(private store: Store<State>, @Inject(PLATFORM_ID) private platformId: any) {
  }

  ngOnInit() {
    if(this.isBrowser) {
      window.onbeforeunload = () => {
        this.store.dispatch(resetAll());
      }
    }
  }
}
