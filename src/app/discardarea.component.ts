import { Component, Input, ViewEncapsulation } from '@angular/core';
import Board from 'src/assets/Board';

@Component({
    selector: 'discardarea',
    templateUrl: './discardarea.component.html',
    encapsulation: ViewEncapsulation.None
})

export class DiscardAreaComponent {
    @Input() cn: String;
    @Input() src: String;
    @Input() receivedBoard: Board;
}


// How to incorporate existing code for updating discard area?
//
    // Based on color of old image, assign to appropriate div
    // if(oldImage.id.match('w')) {
    //     discard = document.getElementsByClassName("white-discards");
    //   } else {
    //     discard = document.getElementsByClassName("black-discards");
    //   }
  
    //   discard[0].appendChild(oldImage);
