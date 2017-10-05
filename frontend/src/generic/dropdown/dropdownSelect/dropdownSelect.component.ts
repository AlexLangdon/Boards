import { Component, Input } from '@angular/core';
import { DropdownCore } from '../dropdownCore';

// Dropdown list with the selected item shown in the button

@Component({
    selector: 'dropdown-select',
    templateUrl: 'dropdownSelect.component.html',
    styleUrls: ['./dropdownSelect.component.css']
})
export class DropdownSelect extends DropdownCore {
    @Input()
      selected: any;

    select(item) {
        this.selected = item;
        super.select(item);
    }
}
