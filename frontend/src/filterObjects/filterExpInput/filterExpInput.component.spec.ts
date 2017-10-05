import { async, getTestBed, ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterExpInput } from './filterExpInput.component';
import { FilterModel } from '../filterModel/filter.model';
import { expect } from 'chai';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MdInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FilterExpInput', () => {
    let component: FilterExpInput;
    let fixture: ComponentFixture<FilterExpInput>;
    const testBoardStrings = ['testBoard1', 'testBoard2'];
    const testTagStrings = ['testTag1', 'testTag2'];
    const testBoards: FilterModel[] = [
        new FilterModel(0, testBoardStrings[0], false),
        new FilterModel(1, testBoardStrings[1], false)
    ];
    const testTags: FilterModel[] = [
        new FilterModel(0, testTagStrings[0], false),
        new FilterModel(1, testTagStrings[1], false)
    ];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FilterExpInput],
            imports: [FormsModule, MdInputModule, BrowserAnimationsModule]
        });

        fixture = TestBed.createComponent(FilterExpInput);
        component = fixture.componentInstance;

        component.boards = testBoards;
        component.tags = testTags;
        fixture.detectChanges();
    }));

    afterEach(() => {
        getTestBed().resetTestingModule();
    });

    it('Should create', () => {
        expect(component).to.be.ok;
    });

    it('Input box should be empty initially', () => {
        const input = fixture.debugElement.query(By.css('input'));
        expect(input.nativeElement.value).to.equal('');
    });

    it('Should populate the input box with the input active boards/tags', () => {
        const expectedText = '@' + testBoardStrings[1] + '#' + testTagStrings[0];
        const newBoards = testBoards.map(board => Object.assign({}, board));
        const newTags = testTags.map(tag => Object.assign({}, tag));
        newBoards[1].active = true;
        newTags[0].active = true;
        component.boards = newBoards;
        component.tags = newTags;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const input = fixture.debugElement.query(By.css('input'));
            expect(input.nativeElement.value).to.equal(expectedText);
        });
    });

    it('Should emit correct active boards/tags based on input filter query', () => {
        const inputText = '#' + testTagStrings[1] + '@' + testBoardStrings[1] + ' #' + testTagStrings[0];
        const expectedBoardStrs = [testBoardStrings[1]];
        const expectedTagStrs = [testTagStrings[1], testTagStrings[0]];
        const inputElem = fixture.debugElement.query(By.css('input')).nativeElement;

        inputElem.value = inputText;
        let emittedBoardStrs: string[];
        component.updateActiveBoards.subscribe((activeBoardStrs: string[]) => emittedBoardStrs = activeBoardStrs);
        let emittedTagsStrs: string[];
        component.updateActiveTags.subscribe((activeTagStrs: string[]) => emittedTagsStrs = activeTagStrs);
        inputElem.dispatchEvent(new Event('input'));
        inputElem.dispatchEvent(new Event('keyup'));

        expect(emittedBoardStrs).to.eql(expectedBoardStrs);
        expect(emittedTagsStrs).to.eql(expectedTagStrs);
    });

    it('Should update the string in the text box when changing active tags, without changing active boards', () => {
        const inputText = '#' + testTagStrings[1] + '@' + testBoardStrings[1];
        const expectedText = '@' + testBoardStrings[1] + '#' + testTagStrings[0] + '#' + testTagStrings[1];
        const inputElem = fixture.debugElement.query(By.css('input')).nativeElement;
        inputElem.value = inputText;
        inputElem.dispatchEvent(new Event('input'));
        inputElem.dispatchEvent(new Event('keyup'));
        const newTags = testTags.map(tag => Object.assign({}, tag));
        newTags[0].active = true;
        newTags[1].active = true;
        component.tags = newTags;

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(inputElem.value).to.equal(expectedText);
        });
    });
});
