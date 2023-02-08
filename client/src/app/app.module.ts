import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from 'src/environments/environment';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ButtonComponent } from './components/elements/button/button.component';
import { StartComponent } from './components/pages/start/start.component';
import { InputComponent } from './components/elements/input/input.component';
import { GameComponent } from './components/pages/game/game.component';
import { ResultsComponent } from './components/pages/results/results.component';
import { PrivacyComponent } from './components/pages/privacy/privacy.component';
import { MasterViewComponent } from './components/modules/master-view/master-view.component';
import { PlayerViewComponent } from './components/modules/player-view/player-view.component';
import { CardComponent } from './components/elements/card/card.component';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers/reducers';
import { AvatarGeneratorModule } from "ng-custom-avatar-generator";
import { FlipCardComponent } from './components/elements/flip-card/flip-card.component';
import { ShareComponent } from './components/elements/share/share.component';
import { CollapsibleComponent } from './components/elements/collapsible/collapsible.component';
import { AvatarGeneratorComponent } from './components/modules/avatar-generator/avatar-generator.component';
import { GameInfoComponent } from './components/modules/game-info/game-info.component';
import { BeforeStartMasterComponent } from './components/modules/before-start-master/before-start-master.component';
import { SetQuestionComponent } from './components/modules/set-question/set-question.component';
import { ModalComponent } from './components/elements/modal/modal.component';
import { AnsweringComponent } from './components/modules/answering/answering.component';
import { SortingComponent } from './components/modules/sorting/sorting.component';
import {DragDropModule} from '@angular/cdk/drag-drop';

const config: SocketIoConfig = {
  url: environment.socketUrl,
  options: {
    transports: ['websocket']
  }
}

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    StartComponent,
    InputComponent,
    GameComponent,
    ResultsComponent,
    PrivacyComponent,
    MasterViewComponent,
    PlayerViewComponent,
    CardComponent,
    FlipCardComponent,
    ShareComponent,
    CollapsibleComponent,
    AvatarGeneratorComponent,
    GameInfoComponent,
    BeforeStartMasterComponent,
    SetQuestionComponent,
    ModalComponent,
    AnsweringComponent,
    SortingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AvatarGeneratorModule,
    DragDropModule,
    StoreModule.forRoot(reducers, {
      metaReducers
    }),
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
