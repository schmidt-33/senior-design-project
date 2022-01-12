import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css']
})
export class InstructionsComponent implements OnInit {

  @Input() instructions: String;

  constructor() { }

  ngOnInit(): void {
  }

}
