import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PictionaryRoutingModule } from './pictionary-routing.module';
import { HomeComponent } from './components/home/home.component';
import { BoardComponent } from './components/board/board.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { GuessesComponent } from './components/guesses/guesses.component';
import { RoundWordChooserComponent } from './components/round-word-chooser/round-word-chooser.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    HomeComponent,
    BoardComponent,
    CanvasComponent,
    GuessesComponent,
    RoundWordChooserComponent,
    AutofocusDirective,
    SpinnerComponent,
  ],
  imports: [
    CommonModule,
    PictionaryRoutingModule,
    SharedModule,
  ]
})
export class PictionaryModule { }
