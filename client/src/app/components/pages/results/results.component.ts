import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {reset, State} from "../../../reducers/reducers";
import {Player} from "../../../model/player.model";
import {ROUTES} from "../../../app-routing.module";
import {Router} from "@angular/router";
import {SocketService} from "../../../services/socket.service";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  public players?: Player[];

  constructor(private store: Store<State>, private router: Router, private socketService: SocketService) {
    store.select("players").subscribe((players) => {
      this.players = [...players].sort((a,b) => b.score - a.score);
    });
  }

  ngOnInit(): void {
    if(!this.players || this.players.length === 0) {
      this.router.navigate([ROUTES.START]);
    }
  }

  public newGame(): void {
    this.store.dispatch(reset());
    this.router.navigate([ROUTES.START]);
  }

}
