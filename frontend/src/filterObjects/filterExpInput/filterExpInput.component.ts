import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FilterModel } from '../filterModel/filter.model';

// Input box for a custom expression to filter notes

@Component({
    selector: 'filter-exp-input',
    templateUrl: './filterExpInput.component.html',
    styleUrls: ['./filterExpInput.component.css']
})
export class FilterExpInput {
    private _activeBoards: string[] = [];
    private _activeTags: string[] = [];

    filterExpression = '';

    @Input()
        set boards(filters: FilterModel[]) {
            this._activeBoards = this.getActiveFilters(filters);
            this.updateFilterString();
        }

    @Input()
        set tags(filters: FilterModel[]) {
            this._activeTags = this.getActiveFilters(filters);
            this.updateFilterString();
        }

    @Output()
        updateActiveBoards: EventEmitter<string[]> = new EventEmitter<string[]>();

    @Output()
        updateActiveTags: EventEmitter<string[]> = new EventEmitter<string[]>();

    getActiveFilters(filters: FilterModel[]) {
        return filters.filter(f => f.active).map(f => f.name);
    }

    // Insert active filters into the text input
    updateFilterString() {
        this.filterExpression = '';
        this._activeBoards.forEach(filter => {
            this.filterExpression += '@' + filter;
        });
        this._activeTags.forEach(filter => {
            this.filterExpression += '#' + filter;
        });
    }

    onKeyUp() {
        // Delimit the filterString by # and @ into an array of tokens
        const splitFilters = this.filterExpression.split(/(?=[#@]+)/)
        // ignore any empty tokens and remove surrounding whitespace
                            .filter(Boolean).filter(str => str.length > 1).map(token => token.trim());

        // Remove the @ and # symbols to get the boards/tags to filter by
        const newBoardFilters = splitFilters.filter(filter => filter.startsWith('@'))
                                .map(filter => filter.substr(1));
        const newTagFilters = splitFilters.filter(filter => filter.startsWith('#'))
                                .map(filter => filter.substr(1));

        // Update the boards/tags used in the filter text
        this._activeBoards = newBoardFilters;
        this.updateActiveBoards.emit(newBoardFilters);

        this._activeTags = newTagFilters;
        this.updateActiveTags.emit(newTagFilters);
    }
}
