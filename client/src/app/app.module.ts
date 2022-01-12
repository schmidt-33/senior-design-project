//? @angular imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { APP_BASE_HREF, CommonModule } from '@angular/common';

//? components
import { AboutPageComponent } from './about/about-page/about-page.component';
import { AppComponent } from './app.component';
import { BattleshipComponent } from './battleship/battleship-page/battleship.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingPageComponent } from './home/landing-page/landing-page.component';
import { SnakeComponent } from './snake/snake-page/snake.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { TriviaComponent } from './trivia/trivia-page/trivia.component';
import { ApplestoapplesComponent } from './applestoapples/applestoapples-page/applestoapples.component';
import { PieceComponent } from './checkers/piece/piece.component';
import { BoardComponent } from './checkers/board/board.component';
import { TictactoeComponent } from './tictactoe/tictactoe-page/tictactoe.component';
import { GridComponent } from './connectfour/grid/grid.component';
import { SpaceinvadersComponent} from './spaceinvaders/spaceinvaders-page/spaceinvaders.component';
import { TetrisComponent } from './tetris/tetris-page/tetris.component';
import { PongComponent } from './pong/pong-page/pong.component';
import { MinesweeperComponent } from './minesweeper/minesweeper-page/minesweeper.component';
import { SpaceraceComponent } from './spacerace/spacerace-page/spacerace.component';

//

//? Shared Components
import { SharedLoadingBarsModule } from './shared/loading-bars/shared-loading-bars.module';

//? Services
import { CheckersService } from './checkers/services/checkers.service';
import { HangmanService } from './hangman/services/hangman.service';
import { SnakeService } from './snake/services/snake.service';
import { TriviaService } from './trivia/services/trivia.service';
import { TictactoeService } from './tictactoe/services/tictactoe.service';

import { BattleshipService } from './battleship/services/battleship.service';
import { SpaceinvadersService } from './spaceinvaders/services/spaceinvaders.service';
import { PongService } from './pong/services/pong.service';
import { MinesweeperService } from './minesweeper/services/minesweeper.service';
import { SpaceraceService } from './spacerace/services/spacerace.service';
import {GridService} from "./connectfour/services/grid.service";
import {GameService} from "./connectfour/services/game.service";

//? Modules
import { ColorPickerModule } from 'ngx-color-picker';
import { TetrisService } from './tetris/services/tetris.service';
import { WinReducer } from './checkers/state/win.reducer';
import { PictionaryModule } from './pictionary/pictionary.module';
import { HangmanModule } from './hangman/hangman.module';
import { AsteroidsPageComponent } from './asteroids/asteroids-page/asteroids-page.component';
import { PlayerModalComponent } from './shared/player-modal/player-modal.component';
import { SharedModule } from './shared/shared.module';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'asteroids', component: AsteroidsPageComponent },
  { path: 'battleship', component: BattleshipComponent },
  { path: 'checkers', component: BoardComponent },
  { path: 'hangman', loadChildren: () => HangmanModule },
  { path: 'snake', component: SnakeComponent },
  { path: 'trivia', component: TriviaComponent },
  { path: 'applestoapples', component: ApplestoapplesComponent },
  { path: 'tictactoe', component: TictactoeComponent },
  { path: 'spaceinvaders', component: SpaceinvadersComponent },
  { path: 'tetris', component: TetrisComponent },
  { path: 'minesweeper', component: MinesweeperComponent },
  { path: 'pong', component: PongComponent },
  { path: 'drawsum', loadChildren: () => PictionaryModule },
  { path: 'connectfour', component: GridComponent },
  { path: '**', component: LandingPageComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    ApplestoapplesComponent,
    BattleshipComponent,
    SnakeComponent,
    BoardComponent,
    PieceComponent,
    AboutPageComponent,
    TriviaComponent,
    SidebarComponent,
    TictactoeComponent,
    SpaceinvadersComponent,
    SpaceraceComponent,
    GridComponent,
    PongComponent,
    MinesweeperComponent,
    TetrisComponent,
    AsteroidsPageComponent,
    PlayerModalComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ColorPickerModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    SharedLoadingBarsModule,
    StoreModule.forRoot({ wins: WinReducer }),
    SharedModule,
  ],
  providers: [
    CheckersService,
    HangmanService,
    BattleshipService,
    SnakeService,
    TriviaService,
    TictactoeService,
    SpaceinvadersService,
    GameService,
    GridService,
    SpaceraceService,
    PongService,
    MinesweeperService,
    TetrisService,
    MinesweeperService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
