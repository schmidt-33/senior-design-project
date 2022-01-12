import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { HangmanPageComponent } from './hangman-page/hangman-page.component';
import { HangmanRoutingModule } from './hangman-routing.module';



@NgModule({
  declarations: [
    HangmanPageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HangmanRoutingModule,
    SharedModule,
  ]
})
export class HangmanModule { }
