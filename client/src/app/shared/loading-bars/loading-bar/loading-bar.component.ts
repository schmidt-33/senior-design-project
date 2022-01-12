import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-loading-bar',
	templateUrl: './loading-bar.component.html',
	styleUrls: ['./loading-bar.component.css']
})
export class LoadingBarComponent {
	@Input() public context: string;
	@Input() public isGlobal: boolean = false;
	@Input() public isEnabled: boolean = true;
}
