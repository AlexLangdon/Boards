import { async, getTestBed, ComponentFixture, TestBed } from '@angular/core/testing';
import { StringInput } from './stringInput.component';
import { expect } from 'chai';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MdInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('String Input', () => {
    let component: StringInput;
    let fixture: ComponentFixture<StringInput>;
    const testStr = 'test123';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StringInput],
            imports: [FormsModule, MdInputModule, BrowserAnimationsModule]
        });

        fixture = TestBed.createComponent(StringInput);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    afterEach(() => {
        getTestBed().resetTestingModule();
    });

    it('Should create', () => {
        expect(component).to.be.ok;
    });

    it('Should store the typed contents', () => {
        const inputBox = fixture.debugElement.query(By.css('input'));
        const boxElem = inputBox.nativeElement;
        expect(boxElem.value).to.equal('');
        boxElem.value = testStr;
        boxElem.dispatchEvent(new Event('input'));
        expect(component.newEntry).to.equal(testStr);
    });

    it('Should emit current entry When clicking the done button', () => {
        const inputBox = fixture.debugElement.query(By.css('input'));
        const button = fixture.debugElement.query(By.css('button'));
        const boxElem = inputBox.nativeElement;
        let entryEmit: string;
        component.entryAdded.subscribe((entry: string) => entryEmit = entry);
        boxElem.value = testStr;
        boxElem.dispatchEvent(new Event('input'));
        button.triggerEventHandler('click', null);
        expect(entryEmit).to.equal(testStr);
    });
});

