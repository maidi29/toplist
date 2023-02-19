import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from 'src/environments/environment';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ButtonComponent } from './components/elements/button/button.component';
import { StartComponent } from './components/pages/start/start.component';
import { TextareaComponent } from './components/elements/textarea/textarea.component';
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
import { RevealingAndSortingComponent } from './components/modules/revealing-and-sorting/revealing-and-sorting.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { TransitionGroupItemDirective } from './directives/transition-group-item.directive';
import { TransitionGroupComponent } from './components/elements/transition-group/transition-group.component';
import {InputComponent} from "./components/elements/input/input.component";
import { BgDecorationComponent } from './components/elements/bg-decoration/bg-decoration.component';
import { ScaleComponent } from './components/elements/scale/scale.component';
import { AnswerCardComponent } from './components/elements/answer-card/answer-card.component';
import {WaitComponent} from "./components/elements/wait/wait.component";
import {LottieModule} from "ngx-lottie";
import player from 'lottie-web';
import { OwnQuestionFormComponent } from './components/elements/own-question-form/own-question-form.component';
import { PredefineQuestionsComponent } from './components/modules/predefine-questions/predefine-questions.component';

const config: SocketIoConfig = {
  url: environment.socketUrl,
  options: {
    transports: ['websocket']
  }
}

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    StartComponent,
    InputComponent,
    TextareaComponent,
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
    RevealingAndSortingComponent,
    TransitionGroupItemDirective,
    TransitionGroupComponent,
    BgDecorationComponent,
    ScaleComponent,
    AnswerCardComponent,
    WaitComponent,
    OwnQuestionFormComponent,
    PredefineQuestionsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AvatarGeneratorModule,
    DragDropModule,
    LottieModule.forRoot({ player: playerFactory }),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
