import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CreateGameComponent } from '../shared/components/create-game/create-game.component';
import { JoinGameComponent } from './components/join-game/join-game.component';
import { BoardHeaderComponent } from './components/board-header/board-header.component';
import { BoardFooterComponent } from './components/board-footer/board-footer.component';
import { InstructionsComponent } from './components/instructions/instructions.component';
import { PlayerCounterComponent } from './components/player-counter/player-counter.component';
import { PlayersComponent } from './components/players/players.component';
import { PreGameComponent } from './components/pre-game/pre-game.component';
import { DescriptionComponent } from './components/description/description.component';


@NgModule({
  declarations: [
    JoinGameComponent,
    CreateGameComponent,
    BoardHeaderComponent,
    BoardFooterComponent,
    InstructionsComponent,
    PlayerCounterComponent,
    PlayersComponent,
    PreGameComponent,
    DescriptionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    JoinGameComponent,
    CreateGameComponent,
    BoardHeaderComponent,
    BoardFooterComponent,
    InstructionsComponent,
    PlayerCounterComponent,
    PlayersComponent,
    PreGameComponent,
    DescriptionComponent,
  ]
})
export class SharedModule { }
