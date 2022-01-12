import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-loading-spinner',
	templateUrl: './loading-spinner.component.html',
	styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {
	@Input() public isGlobal: boolean = false;
	@Input() public isEnabled: boolean = true;
	@Input() public size: string = '16px';
}
