import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'display',
    templateUrl: './display.component.html',
    encapsulation: ViewEncapsulation.None
})

export class DisplayComponent {
    @Input() user: String;
}