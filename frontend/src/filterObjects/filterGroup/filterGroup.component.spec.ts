import { async, inject, getTestBed, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect } from 'chai';
import { FormsModule, FormBuilder } from '@angular/forms';
import { MdInputModule, MdButtonToggleModule, MdDialog,
        MD_DIALOG_SCROLL_STRATEGY_PROVIDER, OVERLAY_PROVIDERS,
        MdCoreModule, MdDialogContainer} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { FilterGroup } from './filterGroup.component';
import { FilterButton } from '../filterButton/filterButton.component';
import { FilterModel } from '../filterModel/filter.model';
import { FilterEditScreen } from '../filterEditScreen/filterEditScreen.component';

@NgModule({
    declarations: [FilterEditScreen],
    entryComponents: [FilterEditScreen, MdDialogContainer],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
class TestingModule {}

describe('FilterGroup', () => {
    let component: FilterGroup;
    let fixture: ComponentFixture<FilterGroup>;
    let dialog: MdDialog;

    const filters = [
        new FilterModel(0, 'filter1', false),
        new FilterModel(1, 'filter2', true),
        new FilterModel(2, 'filter3', false),
    ];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FilterGroup, FilterButton, MdDialogContainer],
            imports: [FormsModule, MdInputModule, MdButtonToggleModule,
                MdCoreModule, BrowserAnimationsModule, TestingModule],
            providers: [MdDialog, FormBuilder,
                MD_DIALOG_SCROLL_STRATEGY_PROVIDER, OVERLAY_PROVIDERS],
            schemas: [NO_ERRORS_SCHEMA]
        }).overrideComponent(FilterEditScreen, {
            set: {
                template: '<span>Mock</span>'
            }
        });

        fixture = TestBed.createComponent(FilterGroup);
        component = fixture.componentInstance;
        component.filters = filters;
        fixture.detectChanges();
    }));

    beforeEach(inject([MdDialog], (d: MdDialog) => {
        dialog = d;
    }));

    afterEach(() => {
        getTestBed().resetTestingModule();
    });

    it('Should create', () => {
        expect(component).to.be.ok;
    });

    it('Should have a filter button for each filter', () => {
        const filterButtons = fixture.debugElement.queryAll(By.directive(FilterButton));
        expect(filterButtons.length).to.equal(component.filters.length);

        filterButtons.forEach((button, i) => {
            const filterInButton = button.componentInstance.filterModel;
            expect(filterInButton).to.eql(component.filters[i]);
        });
    });

    it('Should hide the filter edit dialogue by default', () => {
        expect(component.dialog.openDialogs).to.be.empty;
    });

    it('Should show the filter edit dialogue after clicking on the edit button', () => {
        const editButton = fixture.debugElement.query(By.css('.edit-button'));
        component.showFilterEditBox();
        fixture.detectChanges();
        const numOpenDialogues = component.dialog.openDialogs.length;
        const dialogueClass = dialog.openDialogs[0].componentInstance;
        expect(dialogueClass).to.be.instanceof(FilterEditScreen);
    });

    it('Should pass a toggle event when a filter button is pressed', () => {
        const testFilterButton = fixture.debugElement.query(By.directive(FilterButton));
        const expectedFilter = testFilterButton.componentInstance.filterModel;
        let filterEmitted: FilterModel;
        component.filterToggled.subscribe(filter => filterEmitted = filter);
        testFilterButton.triggerEventHandler('update', expectedFilter);
        expect(filterEmitted).to.eql(expectedFilter);
    });
});
