import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import Board from '../models/Board';

    @Component({
      selector: 'app-button',
      templateUrl: './button.component.html',
      encapsulation: ViewEncapsulation.None
    })

    export class ButtonComponent {

      @Input() label:string;
      @Input() receivedBoard:Board;

      @Output() onClick = new EventEmitter<Board>();

      onClickButton() {
          this.onClick.emit(this.receivedBoard);
      }

    }