// TODO finish when the list note model is finished

// /* tslint:disable:no-unused-variable */
// import { async, getTestBed, ComponentFixture, TestBed } from '@angular/core/testing';
// import { NoteComponent } from './note.component';
// import { NoteModel } from './note.model';
// import { NoteItemModel } from '../noteItem/noteItem.model';
// import { NoteItem } from '../noteItem/noteItem.component';
// import { By } from '@angular/platform-browser';
// import { expect } from 'chai';
// import { DragulaModule } from 'ng2-dragula/ng2-dragula';
// import { DropdownSelect } from '../generic/dropdown/dropdownSelect/dropdownSelect.component';
// import { TagList } from '../tagList/tagList.component';
// import { StringInput } from '../generic/stringInput/stringInput.component';
// import { FormsModule } from '@angular/forms';
// import { MdCardModule, MdIconModule, MdMenuModule } from '@angular/material';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

// describe('NoteComponent', () => {
//     let component: NoteComponent;
//     let fixture: ComponentFixture<NoteComponent>;
//     const testTags = ['tag1', 'tag2', 'tag3'];
//     const testBoards = ['board1', 'board2', 'board3'];
//     const testNoteContents = [
//         new NoteItemModel({id: 0,
//             index: 1,
//             contents: 'item1',
//             complete: true}),
//         new NoteItemModel({id: 1,
//             index: 2,
//             contents: 'item2',
//             complete: false})
//     ];
//     const testNote = new NoteModel({
//         id: 1,
//         title: 'test-title',
//         index: 0,
//         contents: testNoteContents,
//         board: 'board1',
//         tags: ['tag1', 'tag2']
//     });

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [NoteComponent, DropdownSelect, TagList, StringInput, NoteItem],
//             imports: [DragulaModule, FormsModule, MdCardModule, MdIconModule, MdMenuModule],
//             schemas: [NO_ERRORS_SCHEMA]
//         });

//         fixture = TestBed.createComponent(NoteComponent);
//         component = fixture.componentInstance;

//         component.allTags = testTags;
//         component.allBoards = testBoards;
//         component.noteModel = new NoteModel(testNote);
//         component.index = 0;
//         fixture.detectChanges();
//     }));

//     afterEach(() => {
//         getTestBed().resetTestingModule();
//     });

//     it('Should create', () => {
//        expect(component).to.be.ok;
//     });

//     it('Should show the title is as expected', () => {
//         const panelTitleObj = fixture.debugElement.query(By.css('md-card-title'));
//         const panelTitle = panelTitleObj.nativeElement.innerHTML.trim();
//         expect(panelTitle).to.equal(testNote.title);
//     });

//     it('Should show a note item element for each item in the note contents', () => {
//         const noteItems = fixture.debugElement.queryAll(By.css('note-item'));
//         let tempItem: NoteItemModel;
//         for (let i = 0; i < testNote.content.length; i++) {
//             tempItem = noteItems[i].componentInstance.item;
//             expect(tempItem).to.equal(testNote.content[i]);
//         }
//     });

//     it('Should update a new board and emit it', () => {
//         const boardDropdown = fixture.debugElement.query(By.css('dropdown-select'));
//         let emittedNote: NoteModel;
//         component.update.subscribe((newNote: NoteModel) => emittedNote = newNote);
//         boardDropdown.triggerEventHandler('selectItem', testBoards[1]);
//         const expectedNote = new NoteModel(testNote);
//         expectedNote.board = testBoards[1];
//         expect(emittedNote).to.eql(expectedNote);
//     });

//     it('Should be able to add and remove tags', () => {
//         const tagList = fixture.debugElement.query(By.css('tag-list'));
//         const currentTags = component.noteModel.tags.slice();
//         tagList.triggerEventHandler('tagAdded', testTags[2]);
//         expect(component.noteModel.tags).to.eql(testTags);
//         tagList.triggerEventHandler('tagRemoved', testTags[2]);
//         expect(component.noteModel.tags).to.eql(currentTags);
//     });

//     it('Should add a new note item to the note object', () => {
//         const stringInput = fixture.debugElement.query(By.css('string-input'));
//         const newItem = 'new-item';
//         //Expect that no such item exists yet
//         const isInContents = (item: NoteItemModel) => item.content === newItem;
//         expect(component.noteModel.content.findIndex(isInContents)).to.equal(-1);
//         stringInput.triggerEventHandler('entryAdded', newItem);
//         expect(component.noteModel.content.findIndex(isInContents)).to.be.greaterThan(-1);
//     });

//     it('Expect a note update event to emit', () => {
//         const stringInput = fixture.debugElement.query(By.css('string-input'));
//         const newItem = 'new-item';
//         let noteEmitted: NoteModel;
//         component.update.subscribe((note: NoteModel) => noteEmitted = note);
//         stringInput.triggerEventHandler('entryAdded', newItem);
//         expect(noteEmitted).to.equal(component.noteModel);
//     });

//     it('Should remove a note item from object stroage when the item emits a remove event', () => {
//         const testItemElem = fixture.debugElement.query(By.css('note-item'));
//         testItemElem.triggerEventHandler('remove', 0);
//         const expectedItems = testNoteContents.slice(1);
//         expect(component.noteModel.content).to.eql(expectedItems);
//     });

//     it('Should emit an update note event when removing item', () => {
//         const testItemElem = fixture.debugElement.query(By.css('note-item'));
//         const expectedNote = new NoteModel(testNote);
//         expectedNote.content = expectedNote.content.slice(1);
//         let noteEmitted: NoteModel;
//         component.update.subscribe((note: NoteModel) => noteEmitted = note);
//         testItemElem.triggerEventHandler('remove', 0);
//         expect(noteEmitted).to.eql(expectedNote);
//     });

//     it('Should emit the id of the note when clicking the delete button', () => {
//         let emittedId: number;
//         component.remove.subscribe((id: number) => emittedId = id);
//         const deleteButton = fixture.debugElement.query(By.css('.delete-note'));
//         deleteButton.triggerEventHandler('click', null);
//         expect(emittedId).to.equal(testNote.id);
//     });
// });

