import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingBarComponent } from './loading-bar/loading-bar.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

@NgModule({
	declarations: [LoadingBarComponent, LoadingSpinnerComponent],
	imports: [
		CommonModule,
		LoadingBarRouterModule,
		LoadingBarHttpClientModule
	],
	exports: [LoadingBarComponent, LoadingSpinnerComponent]
})
export class SharedLoadingBarsModule { }
