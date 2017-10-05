import { async, getTestBed, ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from 'chai';
import { By } from '@angular/platform-browser';
import { Component, Input, DebugElement } from '@angular/core';
import { FilterModel } from '../filterModel/filter.model';
import { FilterButton } from './filterButton.component';
import { MdButtonToggleModule } from '@angular/material';

// Make a test component to contain the filter-button directive
@Component({
  selector: 'filter-button-test',
  template: '<label filter-button [filterModel]="filter"></label>'
})
class TestComponent {
    @Input()
        filter: FilterModel;
}

describe('FilterButton', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let filterButton: DebugElement;
    const testFilter = new FilterModel(0, 'testFilter', false);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent, FilterButton],
            imports: [MdButtonToggleModule]
        });

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        component.filter = testFilter;
        fixture.detectChanges();
        filterButton = fixture.debugElement.query(By.css('.filter-button'));
    }));

    afterEach(() => {
        getTestBed().resetTestingModule();
    });

    it('Should create', () => {
        expect(component).to.be.ok;
    });

    it('Should contain the filter text inside the button', () => {
        const textShown = filterButton.nativeElement.innerHTML;
        expect(textShown).to.contain(testFilter.name);
    });

    it('Should emit an update event on change', () => {
        let filterEmitted: FilterModel;
        const filterButtonComp = fixture.debugElement.query(By.directive(FilterButton));
        filterButtonComp.componentInstance.update.subscribe((filter: FilterModel) => filterEmitted = filter);
        filterButton.triggerEventHandler('change', null);
        const expectedFilter = testFilter;
        expectedFilter.active = true;
        expect(filterEmitted).to.eql(expectedFilter);
    });
});
