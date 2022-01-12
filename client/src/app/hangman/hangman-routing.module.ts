import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HangmanPageComponent } from './hangman-page/hangman-page.component';

const routes: Routes = [
  { path: '**', component: HangmanPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HangmanRoutingModule { }
