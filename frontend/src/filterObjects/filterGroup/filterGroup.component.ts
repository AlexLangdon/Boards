import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FilterModel } from '../filterModel/filter.model';
import { FilterButton } from '../filterButton/filterButton.component';
import { MdDialog } from '@angular/material';
import { FilterEditScreen, EditScreenInput, EditScreenOutput } from '../filterEditScreen/filterEditScreen.component';
import { NoteProp } from '../../note/noteModels/noteProp.model';

// Shows a list of tags/boards that can be toggled

@Component({
    selector: 'filter-group',
    templateUrl: './filterGroup.component.html',
    styleUrls: ['./filterGroup.component.css']
})
export class FilterGroup {

    @Input()
        title = '';

    @Input()
        filters: FilterModel[];

    @Output()
        filterToggled: EventEmitter<FilterModel> = new EventEmitter<FilterModel>();

    @Output()
        filterUpdated: EventEmitter<NoteProp> = new EventEmitter<NoteProp>();

    @Output()
        filterStrAdded: EventEmitter<string> = new EventEmitter<string>();

    @Output()
        filterDeletedById: EventEmitter<number> = new EventEmitter<number>();

    constructor(public dialog: MdDialog) {}

    toggleFilter(filter: FilterModel) {
        this.filterToggled.emit(filter);
    }

    // Opens the filter edit dialog
    showFilterEditBox() {
        const editScreenInput = new EditScreenInput();
        editScreenInput.title = this.title;
        // Pass a copy of the filters for editing
        editScreenInput.filters = this.filters.map(filter => new NoteProp(filter.id, filter.name));
        const dialogRef = this.dialog.open(FilterEditScreen, {data: editScreenInput});
        dialogRef.afterClosed().subscribe((result: EditScreenOutput) => {
            if (!result) {
                return;
            }

            // Emit the changes made in the dialog
            result.addedFilters.forEach(filter => this.filterStrAdded.emit(filter.name));
            result.updatedFilters.forEach(filter => this.filterUpdated.emit(filter));
            result.deletedFilterIds.forEach(id => this.filterDeletedById.emit(id));
        });
    }
}

