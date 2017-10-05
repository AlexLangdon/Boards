import { async, getTestBed, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteMaker } from './noteMaker.component';
import { TextNoteModel } from '../note/noteModels/textNote.model';
import { DropdownSelect } from '../generic/dropdown/dropdownSelect/dropdownSelect.component';
import { expect } from 'chai';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TagList } from '../tagList/tagList.component';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { NoteProp } from '../note/noteModels/noteProp.model';
import { MdInputModule, MdIconModule, MdCheckboxModule, MdMenuModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('NoteMaker', () => {
    let component: NoteMaker;
    let fixture: ComponentFixture<NoteMaker>;
    const testStr = 'test123';
    const testTags: NoteProp[] = [
        new NoteProp(0, 'tag0'),
        new NoteProp(1, 'tag1'),
        new NoteProp(2, 'tag2')
    ];
    const testBoards: NoteProp[] = [
        new NoteProp(0, 'board0'),
        new NoteProp(1, 'board1'),
        new NoteProp(2, 'board2')
    ];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NoteMaker, DropdownSelect, TagList],
            imports: [FormsModule, DragulaModule, MdInputModule,
                      MdIconModule, MdCheckboxModule, MdMenuModule, BrowserAnimationsModule],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(NoteMaker);
        component = fixture.componentInstance;
        component.allBoards = testBoards;
        component.allTags = testTags;
        fixture.detectChanges();
    }));

    afterEach(() => {
        getTestBed().resetTestingModule();
    });

    it('Should create', () => {
        expect(component).to.be.ok;
    });

    it('Should have nothing as the inital title', () => {
        const titleBox = fixture.debugElement.query(By.css('.title-input'));
        const titleElem = titleBox.nativeElement;
        expect(titleElem.value).to.equal('');
    });

    it('Should store the typed title', () => {
        const titleBox = fixture.debugElement.query(By.css('.title-input'));
        const titleElem = titleBox.nativeElement;
        titleElem.value = testStr;
        titleElem.dispatchEvent(new Event('input'));
        expect(component.newNote.title).to.equal(testStr);
    });

    it('Should store the typed contents', () => {
        const contentsBox = fixture.debugElement.query(By.css('.text-input'));
        const contentElem = contentsBox.nativeElement;
        contentElem.value = testStr;
        contentElem.dispatchEvent(new Event('input'));
        expect(component.newNote.content).to.equal(testStr);
    });

    it('Should set a default board on the new note', () => {
        expect(component.newNote.board).to.be.ok;
    });

    it('Should update the note board when selecting a board in the dropdown', () => {
        const dropdown = fixture.debugElement.query(By.css('dropdown-select'));
        const board1 = testBoards[1];
        dropdown.triggerEventHandler('selectItem', board1);
        expect(component.newNote.board).to.equal(board1);
        const board2 = testBoards[2];
        dropdown.triggerEventHandler('selectItem', board2);
        expect(component.newNote.board).to.equal(board2);
    });

    it('Should update the note colour when one is selected in the colour picker', () => {
        const picker = fixture.debugElement.query(By.css('colour-picker'));
        const newColour = TextNoteModel.NOTE_COLOURS[1];
        picker.triggerEventHandler('colourSelected', newColour);
        expect(component.newNote.colour).to.equal(newColour);
    });

    function noteIsDefault() {
        const blankNote = new TextNoteModel();
        blankNote.board = testBoards[0];
        expect(component.newNote).to.eql(blankNote);
    };

    it('Should revert to a default note when clicking the reset button', () => {
        const resetButton = fixture.debugElement.query(By.css('.reset-button'));
        resetButton.triggerEventHandler('click', null);
        noteIsDefault();
    });

    function submitNote() {
        const doneButton = fixture.debugElement.query(By.css('.done-button'));
        doneButton.triggerEventHandler('click', null);
    };

    it('Should not emit when submitting a default note', () => {
        let emittedNote: TextNoteModel;
        component.noteAdded.subscribe(note => emittedNote = note);
        submitNote();
        expect(emittedNote).to.not.be.ok;
    });

    function getErrorObj() {
        return fixture.debugElement.query(By.css('.title-error'));
    };

    it('Should show an error if a note is submitted with no title', () => {
        submitNote();
        fixture.detectChanges();
        expect(getErrorObj()).to.be.ok;
    });

    function initValidNote() {
        component.newNote.title = testStr;
        component.newNote.content = testStr;
        component.newNote.addTag(testTags[0]);
        component.newNote.board = testBoards[1];
    };

    it('Should emit the note if all details are correct', () => {
        initValidNote();
        const expectedNote = Object.assign(component.newNote);
        let emittedNote: TextNoteModel;
        component.noteAdded.subscribe(note => emittedNote = note);
        submitNote();
        expect(emittedNote).to.eql(expectedNote);
    });

    it('Should remove any errors if note submitted correctly', () => {
        submitNote();
        fixture.detectChanges();
        initValidNote();
        submitNote();
        fixture.detectChanges();
        expect(getErrorObj()).to.not.be.ok;
    });

    it('Should reset to a default note after correctly submitting a note', () => {
        initValidNote();
        submitNote();
        fixture.detectChanges();
        noteIsDefault();
    });
});
