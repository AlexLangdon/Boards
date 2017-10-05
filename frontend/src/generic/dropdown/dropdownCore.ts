import { Component, Input, Output, EventEmitter, ViewChild  } from '@angular/core';
import { MdMenuTrigger } from '@angular/material';

// Encapsulates all dropdown list components

export class DropdownCore {
    @ViewChild(MdMenuTrigger) someTrigger: MdMenuTrigger;

    @Input()
        list = [];

    @Output()
        selectItem: EventEmitter<any> = new EventEmitter<any>();

    select(item) {
        this.selectItem.emit(item);
        // Have to manually trigger close menu to avoid empty menu hanging around
        this.someTrigger.closeMenu();
    }

    isListEmpty() {
        return this.list.length === 0;
    }

    // Converts the list of items to strings
    itemToStr(item): string {
        if (!item) {
            return 'Undefined';
        } else if (typeof item === 'object' &&
            'toUIString' in item) {
            return item.toUIString();
        } else {
            return item.toString();
        }
    }
}
