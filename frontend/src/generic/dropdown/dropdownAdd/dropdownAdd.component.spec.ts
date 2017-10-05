import { async, getTestBed, ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownAdd } from './dropdownAdd.component';
import { expect } from 'chai';
import { By } from '@angular/platform-browser';
import { MdIconModule, MdMenuModule, OverlayContainer } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoteProp } from '../../../note/noteModels/noteProp.model';

describe('DropdownAdd', () => {
    let component: DropdownAdd;
    let fixture: ComponentFixture<DropdownAdd>;
    let overlayContainerElement: HTMLElement;
    const testObjList = [new NoteProp(0, 'item1'), new NoteProp(1, 'item2')];
    const testStringList = ['item1', 'item2'];
    const testObjSelected = testObjList[1];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DropdownAdd],
            imports: [MdMenuModule, BrowserAnimationsModule],
            providers: [
                {provide: OverlayContainer, useFactory: () => {
                    overlayContainerElement = document.createElement('div');
                    overlayContainerElement.classList.add('cdk-overlay-container');
                    document.body.appendChild(overlayContainerElement);

                    // remove body padding to keep consistent cross-browser
                    document.body.style.padding = '0';
                    document.body.style.margin = '0';
                    return {getContainerElement: () => overlayContainerElement};
                  }},
            ]
        });

        fixture = TestBed.createComponent(DropdownAdd);
        component = fixture.componentInstance;
        component.list = testObjList;
        fixture.detectChanges();
    }));

    afterEach(() => {
        document.body.removeChild(overlayContainerElement);
        getTestBed().resetTestingModule();
    });

    it('Should create', () => {
        expect(component).to.be.ok;
    });

    it('Should create with string list input', () => {
        component.list = testStringList;
        expect(component).to.be.ok;
    });

    it('Should show no dropdown initially', () => {
        expect(overlayContainerElement.firstChild).to.be.not.ok;
    });

    function clickDropdown() {
        const trigger = fixture.debugElement.query(By.css('.dropdown-toggle'));
        trigger.triggerEventHandler('click', null);
        fixture.detectChanges();
    }

    it('Should open the dropdown by clicking on the button', () => {
        clickDropdown();
        expect(overlayContainerElement.firstChild).to.be.ok;
    });

    it('Should have an item in the dropdown for each item in the input list', () => {
        clickDropdown();
        const dropdownOptions = overlayContainerElement.querySelectorAll('.option');
        expect(dropdownOptions.length).to.equal(testObjList.length);
        for (let i = 0; i < dropdownOptions.length; i++) {
            const optionText = dropdownOptions[i].innerHTML;
            const expectedText = testObjList[i].toUIString();
            expect(optionText).to.be.equal(expectedText);
        };
    });

    it('Should emit a selected item', () => {
        const expectedItem = component.list[0];
        let emittedItem: NoteProp;
        component.selectItem.subscribe(item => emittedItem = item);

        clickDropdown();
        const anItem = overlayContainerElement.querySelector('.dropdown-item');
        anItem.dispatchEvent(new CustomEvent('mousedown'));
        expect(emittedItem).to.eql(expectedItem);
    });
});
