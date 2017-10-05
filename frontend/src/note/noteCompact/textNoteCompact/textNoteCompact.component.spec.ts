import { async, getTestBed, ComponentFixture, TestBed } from '@angular/core/testing';
import { TextNoteCompact } from './textNoteCompact.component';
import { TextNoteModel } from '../../noteModels/textNote.model';
import { NoteProp } from '../../noteModels/noteProp.model';
import { TagList } from '../../../tagList/tagList.component';
import { ColourPicker } from '../../../generic/colourPicker/colourPicker.component';
import { DropdownSelect } from '../../../generic/dropdown/dropdownSelect/dropdownSelect.component';
import { MdMenuModule, MdInputModule } from '@angular/material';
import { expect } from 'chai';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TextNoteCompact', () => {
    let component: TextNoteCompact;
    let fixture: ComponentFixture<TextNoteCompact>;

    const allBoards: NoteProp[] = [
        new NoteProp(0, 'board0'),
        new NoteProp(1, 'board1'),
        new NoteProp(2, 'board2')
    ];
    const allTags: NoteProp[] = [
        new NoteProp(0, 'tag0'),
        new NoteProp(1, 'tag1'),
        new NoteProp(2, 'tag2')
    ];
    const assignedTags = [allTags[0], allTags[1]];

    const noteModel: TextNoteModel = new TextNoteModel({
        id: 0,
        title: 'title',
        board: allBoards[0],
        tags: assignedTags,
        content: 'content'
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TextNoteCompact, TagList, ColourPicker, DropdownSelect],
            imports: [MdMenuModule, MdInputModule],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(TextNoteCompact);
        component = fixture.componentInstance;
        component.allBoards = allBoards;
        component.allTags = allTags;
        // Have to do assign to account for changes to objects inside noteModel
        component.noteModel = new TextNoteModel(noteModel);
        fixture.detectChanges();
    }));

    afterEach(() => {
        getTestBed().resetTestingModule();
    });

    it('Should create', () => {
        expect(component).to.be.ok;
    });

    it('Should show the title of the input note', () => {
        const titleShownObj = fixture.debugElement.query(By.css('.note-title'));
        const titleShownText = titleShownObj.nativeElement.innerHTML;
        expect(titleShownText).to.contain(noteModel.title);
    });

    it('Should show the current contents of the note', () => {
        const contentsObj = fixture.debugElement.query(By.css('.note-contents'));
        const contentsShown = contentsObj.nativeElement.value;
        expect(contentsShown).to.equal(noteModel.content);
    });

    it('Should emit the updated note when the content edit box loses focus', () => {
        let emittedNote: TextNoteModel;
        component.updateNote.subscribe(newNote => emittedNote = newNote);
        const newContent = 'newContent';
        const expectedNote = new TextNoteModel(noteModel);
        expectedNote.content = newContent;

        const contentsObj = fixture.debugElement.query(By.css('.note-contents'));
        contentsObj.nativeElement.value = newContent;
        contentsObj.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        contentsObj.triggerEventHandler('blur', null);
        fixture.detectChanges();

        expect(component.noteModel).to.eql(expectedNote);
        expect(emittedNote).to.eql(expectedNote);
    });

    // Convert hex colour to rgb format
    function hexToRGB(hex: string) {
        const bigInt = parseInt(component.noteModel.colour, 16);
        const r = (bigInt >> 16) & 255;
        const g = (bigInt >> 8) & 255;
        const b = bigInt & 255;
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    };

    it('Should have the current note colour as the background colour', () => {
        const expectedColour = hexToRGB(component.noteModel.colour);
        const cardObj = fixture.debugElement.query(By.css('md-card'));
        const backgroundShown = cardObj.nativeElement.style.backgroundColor;
        expect(backgroundShown).to.equal(expectedColour);
    });

    it('Should update the colour of the note model to the one chosen in the colour picker', () => {
        const colourPicker = fixture.debugElement.query(By.css('colour-picker'));
        const selectedColour = 'abc123';
        colourPicker.triggerEventHandler('colourSelected', selectedColour);
        fixture.detectChanges();

        const noteColour = component.noteModel.colour;
        expect(noteColour).to.equal(selectedColour);
    });

    it('Should update the colour of the html box to the one chosen in the colour picker', () => {
        const colourPicker = fixture.debugElement.query(By.css('colour-picker'));
        const selectedColour = 'abc123';
        colourPicker.triggerEventHandler('colourSelected', selectedColour);
        fixture.detectChanges();

        const expectedColour = hexToRGB(selectedColour);
        const cardObj = fixture.debugElement.query(By.css('md-card'));
        const backgroundShown = cardObj.nativeElement.style.backgroundColor;
        expect(backgroundShown).to.equal(expectedColour);
    });

    function selectNewBoard(newBoard: NoteProp) {
        const boardDropdownObj = fixture.debugElement.query(By.css('.boards-dropdown'));
        boardDropdownObj.triggerEventHandler('selectItem', newBoard);
    };

    it('Should update the board of the note to the one chosen from the dropdown', () => {
        const newBoard = allBoards[1];
        selectNewBoard(newBoard);
        expect(component.noteModel.board).to.eql(newBoard);
    });

    it('Should emit the updated note model when a new board is set', () => {
        const newBoard = allBoards[1];
        let emittedNote: TextNoteModel;
        component.updateNote.subscribe(note => emittedNote = note);
        const expectedNote: TextNoteModel = new TextNoteModel(component.noteModel);
        expectedNote.board = newBoard;
        selectNewBoard(newBoard);
        expect(emittedNote).to.eql(expectedNote);
    });

    it('Should add a tag to the note when the tag list emits a tag add event', () => {
        const expectedTags = assignedTags.concat(allTags[2]);
        const tagListObj = fixture.debugElement.query(By.css('tag-list'));
        tagListObj.triggerEventHandler('tagAdded', allTags[2]);
        const newTags = component.noteModel.tags;
        expect(newTags).to.eql(expectedTags);
    });

    it('Should remove a tag from the note when the tag list emits a tag remove event', () => {
        const expectedTags = assignedTags.slice(0, 1);
        const tagListObj = fixture.debugElement.query(By.css('tag-list'));
        tagListObj.triggerEventHandler('tagRemovedById', assignedTags[1].id);
        fixture.detectChanges();
        const newTags = component.noteModel.tags;
        expect(newTags).to.eql(expectedTags);
    });

    it('Should emit the id of the note when clicking on the delete button', () => {
        let emittedId: number;
        component.deleteNoteById.subscribe(id => emittedId = id);
        const expectedId = component.noteModel.id;
        const deleteButton = fixture.debugElement.query(By.css('.delete-note'));
        deleteButton.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(emittedId).to.equal(expectedId);
    });
});
