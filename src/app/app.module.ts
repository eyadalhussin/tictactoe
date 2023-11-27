import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule, Routes} from '@angular/router';
import { AppComponent } from './app.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { LocalGameComponent } from './tic-tac-toe/local-game/local-game.component';
import { LocalLobbyComponent } from './tic-tac-toe/local-lobby/local-lobby.component';

const appRoutes:Routes = [
  {path:'', component: TicTacToeComponent, children: [
    {path:'', component:LocalLobbyComponent},
    {path:'LocalGame', component:LocalGameComponent},
  ]},
]

@NgModule({
  declarations: [
    AppComponent,
    TicTacToeComponent,
    LocalGameComponent,
    LocalLobbyComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
