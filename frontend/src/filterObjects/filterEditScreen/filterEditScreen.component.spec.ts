import { async, getTestBed, ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterEditScreen, EditScreenInput, EditScreenOutput } from './filterEditScreen.component';
import { NoteProp } from '../../note/noteModels/noteProp.model';
import { MdDialogRef, MdInputModule, MdCardModule, MD_DIALOG_DATA } from '@angular/material';
import { expect } from 'chai';
import { NgModule } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MdDialogRefMock {
    static outputStored: EditScreenOutput;

    beforeClose(): Observable<any> {
        return Observable.create(observer => {});
    }

    close(closeObj: EditScreenOutput) {
        MdDialogRefMock.outputStored = closeObj;
    }
}

describe('FilterEditScreen', () => {
    let component: FilterEditScreen;
    let fixture: ComponentFixture<FilterEditScreen>;

    const testStr = 'testStr';
    const testFilters: NoteProp[] = [
        new NoteProp(0, 'board0'),
        new NoteProp(1, 'board1'),
        new NoteProp(2, 'board2')
    ];
    const testInput: EditScreenInput = {
        title: testStr,
        filters: testFilters
    };
    const currentFiltersFormCSS = '.current-filters';
    const addedFiltersFormCSS = '.added-filters';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FilterEditScreen],
            providers: [FormBuilder,
                { provide: MdDialogRef, useClass: MdDialogRefMock },
                { provide: MD_DIALOG_DATA, useValue: EditScreenInput }],
            imports: [FormsModule, BrowserAnimationsModule, MdInputModule, 
                ReactiveFormsModule, MdCardModule]
        }).compileComponents();

        fixture = TestBed.createComponent(FilterEditScreen);
        component = fixture.componentInstance;

        component.input.title = testStr;
        // Reset filter object references
        component.input.filters = testFilters.map(filter => new NoteProp(filter.id, filter.name));
        fixture.detectChanges();
    }));

    afterEach(() => {
        getTestBed().resetTestingModule();
    });

    function clickAddFilter() {
        const addButton = fixture.debugElement.query(By.css('.add-filter-button'));
        addButton.nativeElement.click();
        fixture.detectChanges();
    };

    function addNewFilter (newFilterName: string) {
        const inputBox = fixture.debugElement.query(By.css('.new-filter-input'));
        inputBox.nativeElement.value = newFilterName;
        inputBox.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        clickAddFilter();
    };

    function deleteFirstFilterInForm(formClass: string) {
        const firstFilter = getFirstFilterInForm(formClass);
        const deleteButton = firstFilter.query(By.css('.delete-button'));
        deleteButton.nativeElement.click();
        fixture.detectChanges();
    };

    // Returns the error text given in the first filter of a form
    function getFirstFilterErrorInForm(formClass: string) {
        const filter = getFirstFilterInForm(formClass);
        return filter.query(By.css('md-error'));
    };

    function getFirstFilterInForm(formClass: string) {
        const form = fixture.debugElement.query(By.css(formClass));
        return form.query(By.css('md-list-item'));
    };

    // Updates a filter name by index in a given form
    function updateFilterInForm(formClass: string, newFilterName: string, index = 0) {
        const form = fixture.debugElement.query(By.css(formClass));
        const filter = form.queryAll(By.css('md-list-item'))[index];
        const filterInput = filter.query(By.css('input'));
        filterInput.nativeElement.value = newFilterName;
        filterInput.nativeElement.dispatchEvent(new Event('input'));
        filterInput.nativeElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
    }

    function expectFieldsHaveError(controlArray: string, errorType: string,
        expectError: boolean[]) {
            expectError.forEach((bool, i) => {
                const hasError = component.hasFieldError(controlArray, i, errorType);
                expect(hasError).to.equal(expectError[i]);
            });
    }

    function editOperations() {
        addNewFilter(testStr);
        addNewFilter(testStr + '1');
        deleteFirstFilterInForm(currentFiltersFormCSS);
        deleteFirstFilterInForm(addedFiltersFormCSS);
        updateFilterInForm(currentFiltersFormCSS, testStr + '1');
        updateFilterInForm(addedFiltersFormCSS, testStr + '2');
    }

    it('Should create', () => {
        expect(component).to.be.ok;
    });

    it('Should contain the title string in the title object', () => {
        const titleObj = fixture.debugElement.query(By.css('md-card-title'));
        const titleShown = titleObj.nativeElement.innerHTML;
        expect(titleShown).to.contain(testStr);
    });

    it('Should show an entry box for each input filter', () => {
        const listItems = fixture.debugElement.queryAll(By.css('md-list-item'));
        expect(listItems.length).to.equal(testFilters.length);

        for (let i = 0; i < listItems.length; i++) {
            const itemInput = listItems[i].query(By.css('input'));
            const inputValue = itemInput.nativeElement.value;
            expect(inputValue).to.equal(testFilters[i].name);
        }
    });

    it('Should return the names of the field controls in a form via getControlsArray', () => {
        addNewFilter(testStr);
        addNewFilter(testStr + '1');
        const addedControls = component.getControlsArray(component.ADDED_FILTERS);
        expect(addedControls.length).to.eql(2);

        const expectedCurrentControls = testFilters.map(filter => filter.name);
        const currentControls = component.getControlsArray(component.CURRENT_FILTERS);
        expect(currentControls.length).to.eql(3);
    });

    describe('New filter input', () => {

        it('Should initially have an empty new filter input box', () => {
            const inputBox = fixture.debugElement.query(By.css('.new-filter-input'));
            const inputBoxValue = inputBox.nativeElement.value;
            expect(inputBoxValue).to.equal('');
        });

        it('Should show an error if an empty filter is added', () => {
            clickAddFilter();
            const newFilterErrorObj = fixture.debugElement.query(By.css('.new-filter-error'));
            const newFilterErrorText = newFilterErrorObj.nativeElement.innerHTML;
            expect(newFilterErrorText).to.equal(component.EMPTY_ERROR_TXT);
        });

        it('Should not add an empty new filter', () => {
            clickAddFilter();
            const listItems = fixture.debugElement.queryAll(By.css('md-list-item'));
            expect(listItems.length).to.equal(testFilters.length);
        });

        it('Should show an error if the new filter is a duplicate', () => {
            addNewFilter(testFilters[0].name);
            const newFilterErrorObj = fixture.debugElement.query(By.css('.new-filter-error'));
            const newFilterErrorText = newFilterErrorObj.nativeElement.innerText;
            expect(newFilterErrorText).to.equal(component.DUPLICATE_ERROR_TXT);
        });

        it('Should not add a new filter if it is a duplicate', () => {
            addNewFilter(testFilters[0].name);
            const listItems = fixture.debugElement.queryAll(By.css('md-list-item'));
            expect(listItems.length).to.equal(testFilters.length);
        });

        it('Should add a new filter if it has no errors', () => {
            addNewFilter(testStr);
            const newFilterList = testFilters.concat(new NoteProp(3, testStr));
            const listItems = fixture.debugElement.queryAll(By.css('md-list-item'));
            expect(listItems.length).to.equal(newFilterList.length);

            for (let i = 0; i < listItems.length; i++) {
                const itemInput = listItems[i].query(By.css('input'));
                const inputValue = itemInput.nativeElement.value;
                expect(inputValue).to.equal(newFilterList[i].name);
            }
        });

        it('Should empty the new filter input box after adding successfully', () => {
            addNewFilter(testStr);
            fixture.whenStable().then(() => {
                const inputBox = fixture.debugElement.query(By.css('.new-filter-input'));
                const inputBoxValue = inputBox.nativeElement.value;
                expect(inputBoxValue).to.equal('');
            });
        });
    });

    describe('Updating a current filter', () => {

        it(`Should show a duplicate error and not update if a current filter
        is renamed to the same name as another filter`, () => {
            updateFilterInForm(currentFiltersFormCSS, testFilters[1].name);
            const errorObj = getFirstFilterErrorInForm(currentFiltersFormCSS);
            const errorText = errorObj.nativeElement.innerText;
            expect(errorText).to.equal(component.DUPLICATE_ERROR_TXT);
        });

        it(`Should show an empty error and not update if a current filter
            is renamed to the empty string`, () => {
            updateFilterInForm(currentFiltersFormCSS, '');
            const errorObj = getFirstFilterErrorInForm(currentFiltersFormCSS);
            const errorText = errorObj.nativeElement.innerText;
            expect(errorText).to.equal(component.EMPTY_ERROR_TXT);
        });

        it('Should update a current filter if it is renamed correctly and its box loses focus', () => {
            updateFilterInForm(currentFiltersFormCSS, testStr);
            expect(component.input.filters[0].name).to.equal(testStr);
        });

        it('Should add a current filter to the update list if it is renamed correctly', () => {
            const expectedFilter = new NoteProp(testFilters[0].id, testStr);
            updateFilterInForm(currentFiltersFormCSS, testStr);
            const updatedFilter: NoteProp = <NoteProp>(component.updatedFilters[0]);
            expect(updatedFilter).to.eql(expectedFilter);
        });
    });

    describe('Updating an added filter', () => {

        it('Should show a duplicate error if an added filter is renamed to the same name as another filter', () => {
            addNewFilter(testStr);
            updateFilterInForm(addedFiltersFormCSS, testFilters[0].name);
            const errorObj = getFirstFilterErrorInForm(addedFiltersFormCSS);
            const errorText = errorObj.nativeElement.innerText;
            expect(errorText).to.equal(component.DUPLICATE_ERROR_TXT);
        });

        it('Should show an empty error if an added filter is renamed to the empty string', () => {
            addNewFilter(testStr);
            updateFilterInForm(addedFiltersFormCSS, '');
            const errorObj = getFirstFilterErrorInForm(addedFiltersFormCSS);
            const errorText = errorObj.nativeElement.innerText;
            expect(errorText).to.contain(component.EMPTY_ERROR_TXT);
        });

        it('Should update an added filter if it is renamed correctly and its box loses focus', () => {
            const updatedName = testStr + '1';
            addNewFilter(testStr);
            updateFilterInForm(addedFiltersFormCSS, updatedName);

            // Expect no errors to show
            const filterErrorObj = getFirstFilterErrorInForm(addedFiltersFormCSS);
            expect(filterErrorObj).to.not.be.ok;

            const storedName = component.addedFilters[0].name;
            expect(storedName).to.equal(updatedName);
        });

        it('Should correctly show if an entry field has a given error', () => {
            addNewFilter(testStr);
            addNewFilter(testStr + '1');
            addNewFilter(testStr + '2');
            updateFilterInForm(addedFiltersFormCSS, '');
            updateFilterInForm(addedFiltersFormCSS, testStr, 1);
            updateFilterInForm(addedFiltersFormCSS, testStr, 2);
            updateFilterInForm(currentFiltersFormCSS, testStr);
            updateFilterInForm(currentFiltersFormCSS, '', 1);

            const expectEmptysAdded = [true, false, false];
            const expectDuplicateAdded = [false, true, true];
            const expectEmptyCurrent = [false, true, false];
            const expectDuplicateCurrent = [true, false, false];

            expectFieldsHaveError(component.ADDED_FILTERS,
                component.EMPTY_ERROR, expectEmptysAdded);
            expectFieldsHaveError(component.ADDED_FILTERS,
                component.DUPLICATE_ERROR, expectDuplicateAdded);
            expectFieldsHaveError(component.CURRENT_FILTERS,
                component.EMPTY_ERROR, expectEmptyCurrent);
            expectFieldsHaveError(component.CURRENT_FILTERS,
                component.DUPLICATE_ERROR, expectDuplicateCurrent);
        });
    });

    describe('Deleting a current filter', () => {

        it('Should remove a current filter when clicking its delete button', () => {
            const expectedArray = component.input.filters.slice(1);
            deleteFirstFilterInForm(currentFiltersFormCSS);
            expect(component.input.filters).to.eql(expectedArray);
        });

        it('Should add a current filter id to the deleted list when clicking its delete button', () => {
            const expectedFilterIds = [testFilters[0].id];
            deleteFirstFilterInForm(currentFiltersFormCSS);
            expect(component.deletedFilterIds).to.eql(expectedFilterIds);
        });

        it('Should remove an updated filter from the update list when clicking its delete button', () => {
            updateFilterInForm(currentFiltersFormCSS, testStr);
            deleteFirstFilterInForm(currentFiltersFormCSS);
            const updatedFilters = component.updatedFilters;
            expect(updatedFilters).to.be.empty;
        });
    });

    describe('Deleting an added filter', () => {

        it('Should remove an added filter from the view when clicking its delete button', () => {
            const secondAddedFilter = testStr + '1';
            addNewFilter(testStr);
            addNewFilter(secondAddedFilter);
            deleteFirstFilterInForm(addedFiltersFormCSS);
            const filter = getFirstFilterInForm(addedFiltersFormCSS);
            const filterInput = filter.query(By.css('input'));
            const filterValue = filterInput.nativeElement.value;
            expect(filterValue).to.eql(secondAddedFilter);
        });

        it('Should remove an added filter from the added list when clicking its delete button', () => {
            addNewFilter(testStr);
            addNewFilter(testStr + '1');
            const expectedAddedFilters = component.addedFilters.slice(1);
            deleteFirstFilterInForm(addedFiltersFormCSS);
            expect(component.addedFilters).to.eql(expectedAddedFilters);
        });

        it('Should remove duplicate errors from shown filters if other clashing filters are deleted', () => {
            // Add a new filter
            addNewFilter(testStr);
            // Change current filter to match new filter name
            updateFilterInForm(currentFiltersFormCSS, testStr);
            // Remove added filter
            deleteFirstFilterInForm(addedFiltersFormCSS);
            // New filter should have no error
            const filterErrorObj = getFirstFilterErrorInForm(currentFiltersFormCSS);
            expect(filterErrorObj).to.not.be.ok;
        });
    });

    it(`Should emit a close dialogue event with added, updated and deleted filters,
        when clicking on the done button`, () => {
        const expectedAdded = [new NoteProp(null, testStr + '2')];
        const expectedUpdated = [new NoteProp(testFilters[1].id, testStr + '1')];
        const expectedDeleted = [testFilters[0].id];
        const expectedOutput = new EditScreenOutput();
        expectedOutput.addedFilters = expectedAdded;
        expectedOutput.updatedFilters = expectedUpdated;
        expectedOutput.deletedFilterIds = expectedDeleted;

        editOperations();

        const doneButton = fixture.debugElement.query(By.css('.done-button'));
        doneButton.nativeElement.click();
        expect(MdDialogRefMock.outputStored).to.eql(expectedOutput);
    });

    it('Should correctly identify when an input filter name already exists', () => {
        addNewFilter(testStr);
        const filterExists = component.filterNameExists(testStr);
        expect(filterExists).to.be.true;
    });

    it('Should correctly identify when an input filter name does not exist', () => {
        addNewFilter(testStr);
        const filterExists = component.filterNameExists(testStr + '1');
        expect(filterExists).to.be.false;
    });

});
