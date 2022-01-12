import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-player-modal',
	templateUrl: './player-modal.component.html',
	styleUrls: ['./player-modal.component.css']
})
export class PlayerModalComponent {
	@Input() title;
	@Input() body;
	@Input() footerText;

	constructor(public activeModal: NgbActiveModal) { }
}
