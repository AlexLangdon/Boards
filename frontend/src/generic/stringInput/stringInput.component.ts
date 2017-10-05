import { Component, Output, EventEmitter } from '@angular/core';

// Represents a simple text entry field

@Component ({
    selector: 'string-input',
    templateUrl: 'stringInput.component.html',
    styleUrls: ['./stringInput.component.css']
})
export class StringInput {
    newEntry = '';

    @Output()
       entryAdded: EventEmitter<string> = new EventEmitter<string>();

    onAddEntry() {
        this.entryAdded.emit(this.newEntry);
        this.newEntry = '';
    }

    errorMatcher(control) {
        return true;
    }
}
