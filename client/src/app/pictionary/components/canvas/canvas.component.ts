import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {fabric } from 'fabric';
import { Observable } from 'rxjs';
import * as constants from '../../../../../../pictionary/constants';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  @Input() playerTurn: boolean = false;
  @Input() gameCode: string;
  @Output() canvasUpdated = new EventEmitter();

  canvas: fabric.Canvas;
  colors: string[] = constants.colors;
  selectedColor: string = this.colors[0];
  selectedBackgroundColor: string = this.colors[1];
  sizes: number[] = constants.sizes;
  selectedWidth: number = this.sizes[0];
  widthDelta = 10;

  constructor(
    private gameService: GameService,
  ) { }

  ngOnInit(): void {
    this.initializeCanvas();
  }

  updateCanvas(event) {
    this.gameService.canvasUpdated(this.gameCode, this.canvas);
  }

  initializeCanvas() {
    this.canvas = new fabric.Canvas('canvas');
    this.canvas.backgroundColor = constants.colors[1];
    this.canvas.renderAll();
    
    if (this.playerTurn) {
      this.canvas.isDrawingMode = this.playerTurn;
      this.canvas.freeDrawingBrush.color = constants.colors[0];
      this.canvas.freeDrawingBrush.width = this.selectedWidth;
      this.canvas.renderAll();

      this.canvas.on('after:render', (event) => this.updateCanvas(event));
      this.canvas.on('mouse:up', (event) => this.updateCanvas(event));
      this.canvas.on('mouse:move', (event) => this.updateCanvas(event));
      this.canvas.on('mouse:moving', (event) => this.updateCanvas(event));
      this.canvas.on('object:moving', (event) => this.updateCanvas(event));
      this.canvas.on('object:modified', (event) => this.updateCanvas(event));
      this.canvas.on('object:moving', (event) => this.updateCanvas(event));
      this.canvas.on('path:created', (event) => this.updateCanvas(event));
    } else {
      this.gameService.getCanvas(this.gameCode).subscribe(
        (data: any) => {
          if (data.error) {
            throw new Error(data.error);
          }
          this.canvas.loadFromJSON(data.canvas, this.canvas.renderAll.bind(this.canvas));
        },
        (error: any) => {
          console.log('Could not load canvas', error);
        }
      )
    }
  }

  selectColor(color: string) {
    this.selectedColor = color;
    this.canvas.freeDrawingBrush.color = color;
  }

  setSize(size: number) {
    this.selectedWidth = size;
    this.canvas.freeDrawingBrush.width = size;
  }

  increaseSize() {
    this.setSize(this.selectedWidth + this.widthDelta);
  }

  decreaseSize() {
    this.setSize(this.selectedWidth - this.widthDelta);
  }

  selectBackgroundColor(color: string) {
    this.selectedColor = color;
    this.canvas.backgroundColor = color;
    this.canvas.renderAll();
  }

}
