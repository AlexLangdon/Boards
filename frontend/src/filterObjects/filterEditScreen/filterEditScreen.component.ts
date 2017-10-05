import { Component, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { NoteProp } from '../../note/noteModels/noteProp.model';
import { FormArray, FormBuilder, FormControl, FormGroup,
    Validators, ValidatorFn, AbstractControl } from '@angular/forms';

export class EditScreenInput {
    title: string;
    filters: NoteProp[];
}

export class EditScreenOutput {
    addedFilters: NoteProp[];
    updatedFilters: NoteProp[];
    deletedFilterIds: number[];
}

// Detects if a filter name already exists in the list
class FilterDuplicateValidator {
    constructor(private linkedFilter: NoteProp,
        private filterEditScreen: FilterEditScreen) {}

    filterDuplicateValidator(control: AbstractControl): { [s: string]: boolean } {
        if (this.linkedFilter.name !== control.value &&
            this.filterEditScreen.filterNameExists(control.value)) {
                return { duplicate : true };
            }
    }
}

// A dialog for managing the list of boards/tags

@Component({
    selector: 'filter-edit-screen',
    templateUrl: './filterEditScreen.component.html',
    styleUrls: ['./filterEditScreen.component.css']
})
export class FilterEditScreen implements OnInit {
    readonly DUPLICATE_ERROR = 'duplicate';
    readonly EMPTY_ERROR = 'required';
    readonly DUPLICATE_ERROR_TXT = 'Already exists';
    readonly EMPTY_ERROR_TXT = 'Cannot be empty';
    readonly CURRENT_FILTERS = 'currentFilters';
    readonly ADDED_FILTERS = 'addedFilters';

    private _addedFilters: NoteProp[] = [];
    // Filters already commited in the database that need updating
    private _updatedFilters: NoteProp[] = [];
    private _deletedFilterIds: number[] = [];

    // TODO the new filter input could use a form control validator instead
    private _inputFilterError = '';

    editFilterForm: FormGroup;
    inputFilterName = '';

    constructor(public dialogRef: MdDialogRef<FilterEditScreen>,
                @Inject(MD_DIALOG_DATA) public input: EditScreenInput,
                private formBuilder: FormBuilder) {}

    ngOnInit() {
        // Store existing filters in a currentFilter 
        // and filters added via this dialog in newFilters
        const currentFilterFields = this.formBuilder.array([]);
        const newFilterFields = this.formBuilder.array([]);

        // Add a form field for each current filter
        this.input.filters.forEach((filter: NoteProp, i: number) => {
            const validator = new FilterDuplicateValidator(filter, this);
            // Have to use .bind to refer to outer class instance
            currentFilterFields.push(new FormControl(filter.name,
                [Validators.required, validator.filterDuplicateValidator.bind(validator)]));
        });
        this.editFilterForm = this.formBuilder.group({
            currentFilters: currentFilterFields,
            addedFilters: newFilterFields
        });
    }

    private hasFilterChanged(newFilterName: string, index: number) {
        return this.input.filters[index].name !== newFilterName;
    }

    // Updates field validity and checks if an update is needed
    private _updateFieldValidity() {
        const currentFilterValidators =
            <FormArray>this.editFilterForm.controls[this.CURRENT_FILTERS];
        currentFilterValidators.controls.forEach((validator, i) => {
            if (validator.invalid) {
                validator.updateValueAndValidity();
                this.updateFilter(validator.value, i);
            }
        });

        const addedFilterValidators =
            <FormArray>this.editFilterForm.controls[this.ADDED_FILTERS];
        currentFilterValidators.controls.forEach((validator, i) => {
            if (validator.invalid) {
                validator.updateValueAndValidity();
                this.updateAddedFilter(validator.value, i);
            }
        });
    }

    filterNameExists(filterName: string): boolean {
        return this.input.filters.concat(this._addedFilters)
            .some(filter => filter.name === filterName);
    }

    updateFilter(newFilterName: string, index: number) {
        // Only update filter if the new value is valid and is different from previous
        if (this.editFilterForm.get([this.CURRENT_FILTERS, index]).invalid ||
            !this.hasFilterChanged(newFilterName, index)) { return; }
        this.input.filters[index].name = newFilterName;
        const filterObj = this.input.filters[index];
        // If the filter was added to the update list then change its value
        // else add it to the list of filters to updated on the backend
        const indexInUpdateList = this._updatedFilters.findIndex(filter => filter.id === filterObj.id);
        if (indexInUpdateList > -1) {
            this._updatedFilters[indexInUpdateList] = filterObj;
        } else {
            this._updatedFilters.push(filterObj);
        }
    }

    deleteFilter(index: number) {
        const filterId = this.input.filters[index].id;
        this._deletedFilterIds.push(filterId);
        this.input.filters.splice(index, 1);

        // Delete corresponding validaton control
        const controls = <FormArray>this.editFilterForm.controls[this.CURRENT_FILTERS];
        controls.removeAt(index);
        // Remove the filter from the list of filters to update
        // Use findindex and splice for speed
        const indexInUpdatedList = this._updatedFilters.findIndex(f => f.id === filterId);
        if (indexInUpdatedList > -1) {
            this._updatedFilters.splice(indexInUpdatedList, 1);
        }

        this._updateFieldValidity();
    }

    addFilter() {
        // Only add a filter if it does not already exist
        if (this.inputFilterName === '') {
            this._inputFilterError = this.EMPTY_ERROR_TXT;
        } else if (this.filterNameExists(this.inputFilterName)) {
            this._inputFilterError = this.DUPLICATE_ERROR_TXT;
        } else {
            const newFilter = new NoteProp(null, this.inputFilterName);
            this._addedFilters.push(newFilter);

            // Add validator
            const validator = new FilterDuplicateValidator(newFilter, this);
            const arrayControl = <FormArray>this.editFilterForm.controls[this.ADDED_FILTERS];
            arrayControl.push(new FormControl(newFilter.name,
                [Validators.required, validator.filterDuplicateValidator.bind(validator)]));

            this.inputFilterName = '';
            this._inputFilterError = '';
        }
    }

    // Functions for changing filters that have not been commited to database
    updateAddedFilter(newFilterName: string, index: number) {
        // Only update to this value if it is valid
        if (this.editFilterForm.get([this.ADDED_FILTERS, index]).valid) {
            // No need to add to updatedFilters if the new filter has not been commited
            this._addedFilters[index].name = newFilterName;
            this._updateFieldValidity();
        }
    }

    deleteAddedFilter(index: number) {
        // Delete corresponding validaton control
        const controls = <FormArray>this.editFilterForm.controls[this.ADDED_FILTERS];
        controls.removeAt(index);

        // Remove the filter from the list of filters to add
        this._addedFilters.splice(index, 1);
        this._updateFieldValidity();
    }

    // Wmit the changes when finished with the dialog
    closeScreen() {
        const output = new EditScreenOutput();
        output.addedFilters = this._addedFilters;
        output.updatedFilters = this._updatedFilters;
        output.deletedFilterIds = this._deletedFilterIds;
        this.dialogRef.close(output);
    }

    hasFieldError(controlArray: string, controlIndex: number, errorType: string) {
        return this.editFilterForm.get([controlArray, controlIndex]).hasError(errorType);
    }

    hasNewFilterError() {
        return this._inputFilterError !== '';
    }

    getControlsArray(arrayName: string) {
        return Object.keys((<FormArray>this.editFilterForm.controls[arrayName]).controls);
    }

    get newFilterError() {
        return this._inputFilterError;
    }

    get addedFilters() {
        return this._addedFilters;
    }

    get updatedFilters() {
        return this._updatedFilters;
    }

    get deletedFilterIds() {
        return this._deletedFilterIds;
    }
}
