import { Component, Input, Output, EventEmitter} from '@angular/core';
import { FilterModel } from '../filterModel/filter.model';

// A togglable button for activating a given tag/board filter

@Component({
    selector: '[filter-button]',
    templateUrl: './filterButton.component.html',
    styleUrls: ['./filterButton.component.css']
})
export class FilterButton {

    @Input()
        filterModel: FilterModel;

    @Output()
        update: EventEmitter<FilterModel> = new EventEmitter<FilterModel>();

    onChange() {
        this.filterModel.active = !this.filterModel.active;
        this.update.emit(this.filterModel);
    }
}

