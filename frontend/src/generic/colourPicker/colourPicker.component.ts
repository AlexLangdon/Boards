import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

// The component for selecting a colour on a note

@Component({
    selector: 'colour-picker',
    templateUrl: './colourPicker.component.html',
    styleUrls: ['./colourPicker.component.css']
})
export class ColourPicker {
    @Input()
        colours: string[];

    @Input()
        currentColour: string;

    @Output()
        colourSelected: EventEmitter<string> = new EventEmitter<string>();

    select(colour: string) {
        this.colourSelected.emit(colour);
    }
}
