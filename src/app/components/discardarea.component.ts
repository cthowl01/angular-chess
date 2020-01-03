import { Component, Input, ViewEncapsulation } from '@angular/core';
import Board from '../models/Board';

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
