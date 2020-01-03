import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

    @Component({
      selector: 'game-square',
      templateUrl: './square.component.html',
      styleUrls: ['./app.component.css']
    })

    export class SquareComponent implements OnInit {
      @Input() id:string;
      @Input() src:string;
      @Input() functionCall:string;
      @Output() onOver = new EventEmitter<any>();
      @Output() onOut = new EventEmitter<any>();

    onMouseOver(event) {
        this.onOver.emit(event);
    }

    onMouseOut(event) {
        this.onOut.emit(event);
    }

      constructor() { }

      ngOnInit() {
      }

    }