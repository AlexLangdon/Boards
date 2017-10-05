/* tslint:disable:no-unused-variable */

import { getTestBed, TestBed, ComponentFixture, async } from '@angular/core/testing';
import { Dashboard } from './dashboard.component';
import { By } from '@angular/platform-browser';
import { expect } from 'chai';
import { Component, OnInit } from '@angular/core';
import { DragulaModule, DragulaService } from 'ng2-dragula/ng2-dragula';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdDialog, MD_DIALOG_SCROLL_STRATEGY_PROVIDER,
    OVERLAY_PROVIDERS, ScrollDispatcher,
    Platform, ScrollStrategyOptions } from '@angular/material';

import { BoardService } from '../backend/board/board.service';
import { NoteService } from '../backend/note/note.service';
import { UserService } from '../backend/user/user.service';
import { APIBoard } from '../backend/apiModels/apiBoard.model';
import { APINote } from '../backend/apiModels/apiNote.model';
import { APITag } from '../backend/apiModels/apiTag.model';

import { NoteMaker } from '../noteMaker/noteMaker.component';
import { TextNoteModel } from '../note/noteModels/textNote.model';
import { TextNoteCompact } from '../note/noteCompact/textNoteCompact/textNoteCompact.component';
import { FilterGroup } from '../filterObjects/filterGroup/filterGroup.component';
import { FilterExpInput } from '../filterObjects/filterExpInput/filterExpInput.component';
import { FilterModel } from '../filterObjects/filterModel/filter.model';
import { NoteProp } from '../note/noteModels/noteProp.model';

describe('Dashboard', () => {
    const allBoards = [
        new NoteProp(0, 'board0'),
        new NoteProp(1, 'board1'),
        new NoteProp(2, 'board2'),
        new NoteProp(3, 'board3')
    ];
    const userBoards = allBoards.slice(0, -1);

    const userTags = [
        new NoteProp(0, 'tag0'),
        new NoteProp(1, 'tag1'),
        new NoteProp(2, 'tag2')
    ];

    const allNotes: TextNoteModel[] = [
        new TextNoteModel({
            id: 0,
            index: 0,
            title: 'title0',
            board: allBoards[0],
            tags: [],
            content: 'contents0'
        }),
        new TextNoteModel({
            id: 1,
            index: 2,
            title: 'title1',
            board: allBoards[1],
            tags: [userTags[0]],
            content: 'contents1'
        }),
        new TextNoteModel({
            id: 2,
            index: 1,
            title: 'title2',
            board: allBoards[0],
            tags: [userTags[0], userTags[1]],
            content: 'contents2'
        }),
        new TextNoteModel({
            id: 3,
            index: 3,
            title: 'title3',
            board: allBoards[3],
            tags: [],
            content: 'contents3'
        }),
    ];
    const userNotes = [allNotes[0], allNotes[2], allNotes[1]];

    class MockBoardService {
        public getBoard(boardId: number): Observable<APIBoard> {
            const matchingBoard = userBoards.find(board => board.id === boardId);
            return Observable.of(new APIBoard(matchingBoard));
        }

        public postBoard(username: string, boardName: string): Observable<APIBoard> {
            return Observable.of(new APIBoard({title: boardName}));
        }

        public deleteBoard(boardId: number): Observable<null> {
            return Observable.of(null);
        }

        public patchBoard(board: APIBoard): Observable<null> {
            return Observable.of(null);
        }
    };

    class MockUserService {
        public getBoards(username: string): Observable<APIBoard[]> {
            const boards = userBoards.map(board => new APIBoard(board));
            return Observable.of(boards);
        }

        public getTags(username: string): Observable<APITag[]> {
            const tags = userTags.map(tag => new APITag(tag));
            return Observable.of(tags);
        }

        public putTag(username: string, tagName: string): Observable<APITag> {
            const matchingTag = userTags.find(tag => tag.name === tagName);
            const newTag = Object.assign({}, matchingTag) as NoteProp;
            newTag.name = tagName;
            return Observable.of(new APITag(newTag));
        }

        public patchTag(username: string, tagId: number, newTag: APITag) {
            return Observable.of(null);
        }

        public deleteTag(username: string, tagId: number): Observable<null> {
            return Observable.of(null);
        }
    };

    class MockNoteService {
        public postNote(note: APINote): Observable<APINote> {
            return Observable.of(note);
        }

        public getBoardNotes(boardId: number): Observable<APINote[]> {
            const matchingNotes = allNotes.filter(note => note.board.id === boardId);
            const apiNotes = matchingNotes.map(note => new APINote(note));
            return Observable.of(apiNotes);
        }

        public deleteNote(id: number): Observable<null> {
            return Observable.of(null);
        }

        public patchNote(note: TextNoteModel): Observable<null> {
            return Observable.of(null);
        }
    };

    let component: Dashboard;
    let fixture: ComponentFixture<Dashboard>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                Dashboard,
                TextNoteCompact,
                NoteMaker,
                FilterGroup,
                FilterExpInput
            ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [DragulaModule, ReactiveFormsModule, FormsModule]
        }).overrideComponent(Dashboard, {
            set: {
                providers: [
                    { provide: BoardService, useClass: MockBoardService },
                    { provide: UserService, useClass: MockUserService },
                    { provide: NoteService, useClass: MockNoteService },
                    DragulaService,
                    MdDialog,
                    MD_DIALOG_SCROLL_STRATEGY_PROVIDER,
                    ScrollDispatcher,
                    ScrollStrategyOptions,
                    Platform,
                    OVERLAY_PROVIDERS
                ]
            }
        });
        TestBed.compileComponents();
        fixture = TestBed.createComponent(Dashboard);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
    }));

    afterEach(() => {
        getTestBed().resetTestingModule();
    });

    it('Should create the app', () => {
        expect(component).to.be.ok;
    });

    it('Should store the array of note model objects as given by the service', () => {
        expect(component.notes).to.eql(userNotes);
    });

    it('Should make a note element for each note model given by the service', () => {
        const noteElems = fixture.debugElement.queryAll(By.css('text-note'));
        expect(noteElems.length).to.equal(userNotes.length);
        for (let i = 0; i < noteElems.length; i++) {
            const modelInNote = noteElems[i].componentInstance.noteModel;
            expect(modelInNote).to.eql(userNotes[i]);
        }
    });

    it('Should show all notes by default', () => {
        const noteElems = fixture.debugElement.queryAll(By.css('text-note'));
        let isHidden: TextNoteModel;
        noteElems.forEach(elem => {
            isHidden = elem.nativeElement.hasAttribute('hidden');
            expect(isHidden).to.be.false;
        });
    });

    it('Should make a post request to the note service when adding a note ', () => {
        const newNoteBoard = new NoteProp(userBoards[1].id, userBoards[1].name);
        const newNote = new TextNoteModel({
            id: 4,
            index: 0,
            title: 'title4',
            board: Object.assign({}, newNoteBoard),
            tags: [userTags[2]],
            content: 'contents4'
        });

        const expectedNotes = userNotes.concat(newNote);
        component.addNote(newNote);
        //TODO Should not add a title property to the board object during addNote
        newNote.board = newNoteBoard;
        expect(component.notes).to.eql(expectedNotes);
    });

    it('Should make a delete request to the note service when deleting a note', () => {
        const noteId = userNotes[2].id;
        const boardId = userNotes[2].board.id;
        const expectedNotes = userNotes.slice(0, -1);

        component.deleteNote(noteId, boardId);
        expect(component.notes).to.eql(expectedNotes);
    });

    it('Should hide notes that do not meet filter criteria for boards', () => {
        const activeBoardName = 'board0';
        component.boardFilters.map(filter => filter.active = filter.name === activeBoardName);
        fixture.detectChanges();
        const noteElems = fixture.debugElement.queryAll(By.css('text-note'));

        for (let i = 0; i < noteElems.length; i++) {
            const isHidden = noteElems[i].nativeElement.hasAttribute('hidden');
            const expectedHidden = component.notes[i].board.name !== activeBoardName;
            expect(isHidden).to.equal(expectedHidden);
        }
    });

    it('Should hide notes that do not meet filter criteria for tags', () => {
        const activeTag = 'tag1';
        component.tagFilters.forEach(filter =>
            filter.active = (filter.name === activeTag));
        fixture.detectChanges();
        const noteElems = fixture.debugElement.queryAll(By.css('text-note'));

        for (let i = 0; i < noteElems.length; i++) {
            const isHidden = noteElems[i].nativeElement.hasAttribute('hidden');
            const expectedHidden = component.notes[i].tags.every(tag => tag.name !== activeTag);
            expect(isHidden).to.equal(expectedHidden);
        }
    });

    it('Should hide notes that do not meet filter criteria for boards + tags', () => {
        const activeTags = ['tag0', 'tag1', 'tag2'];
        const activeBoard = 'board1';
        component.tagFilters.forEach(filter =>
            filter.active = (activeTags.indexOf(filter.name) > -1));
        component.boardFilters.forEach(filter =>
            filter.active = (filter.name === activeBoard));
        fixture.detectChanges();
        const noteElems = fixture.debugElement.queryAll(By.css('text-note'));

        for (let i = 0; i < noteElems.length; i++) {
            const isShown = !noteElems[i].nativeElement.hasAttribute('hidden');
            const expectedShown = activeTags.some(activeTag =>
                component.notes[i].tags.some(tag => tag.name === activeTag)) &&
                component.notes[i].board.name === activeBoard;
            expect(isShown).to.equal(expectedShown);
        }
    });

    it('Should correctly update the active filters using an array of strings', () => {
        const initTags: FilterModel[] = [
            new FilterModel(0, 'tag1', true),
            new FilterModel(1, 'tag2', false)
        ];
        const newActiveTags = ['tag2'];
        const expectedTags: FilterModel[] = [
            new FilterModel(0, 'tag1', false),
            new FilterModel(1, 'tag2', true)
        ];

        component.tagFilters = initTags;
        component.setActiveFilters(newActiveTags, component.tagFilters);
        expect(component.tagFilters).to.eql(expectedTags);
    });

    it('Should correctly update a filter object that has a given filterText', () => {
        const newFilter = new FilterModel(1, 'tag2', true);
        const initFilters: FilterModel[] = [
            new FilterModel(0, 'tag1', true),
            new FilterModel(1, 'tag2', false),
            new FilterModel(2, 'tag3', false)
        ];
        const expectedFilters: FilterModel[] = [
            new FilterModel(0, 'tag1', true),
            new FilterModel(1, 'tag2', true),
            new FilterModel(2, 'tag3', false)
        ];

        const newFilters = component.replaceFiltersInSet(newFilter, initFilters);
        expect(newFilters).to.eql(expectedFilters);
    });

    it('Should add a board to the list of boards via the boards service', () => {
        const newBoardName = 'newBoard';
        const expectedBoards = component.boardFilters.concat(new FilterModel(undefined, newBoardName));
        component.addBoard(newBoardName);
        expect(component.boardFilters).to.eql(expectedBoards);
    });

    it('Should update a board in the list of board via the boards service', () => {
        const newBoards = userBoards.map(board => new FilterModel(board.id, board.name));
        newBoards[0].name = 'newBoard';
        component.updateBoard(newBoards[0]);
        expect(component.boardFilters).to.eql(newBoards);
    });

    it('Should be able to delete a board from the list of filters', () => {
        const deletedBoardId = allBoards[1].id;
        const expectedBoards = component.boardFilters.filter(board => board.id !== deletedBoardId);
        component.deleteBoardById(deletedBoardId);
        expect(component.boardFilters).to.eql(expectedBoards);
    });

    it('Should delete all notes that have a deleted board', () => {
        const deletedBoardId = allBoards[1].id;
        const expectedNoteList = component.notes.filter(note => note.board.id !== deletedBoardId);
        component.deleteBoardById(deletedBoardId);
        expect(component.notes).to.eql(expectedNoteList);
    });

    it('Should add a tag to the list of tag via the user service', () => {
        const newTagName = 'newTag';
        const expectedTags = component.tagFilters.concat(new FilterModel(undefined, newTagName));
        component.addTag(newTagName);
        expect(component.tagFilters).to.eql(expectedTags);
    });

    it('Should update a tag in the list of tags via the user service', () => {
        const newTags = userTags.map(tag => new FilterModel(tag.id, tag.name));
        newTags[0].name = 'newTag';
        component.updateTag(newTags[0]);
        expect(component.tagFilters).to.eql(newTags);
    });

    it('Should be able to delete a tag from the list of filters', () => {
        const deletedTagId = userTags[1].id;
        const expectedTags = component.tagFilters.filter(tag => tag.id !== deletedTagId);
        component.deleteTagById(deletedTagId);
        expect(component.tagFilters).to.eql(expectedTags);
    });

    it('Should delete a tag from all associated notes when it is deleted', () => {
        const deletedTagId = userTags[1].id;
        component.deleteTagById(deletedTagId);
        component.notes.forEach(note => {
            const noteContainsTag = note.tags.some(tag => tag.id === deletedTagId);
            expect(noteContainsTag).to.be.false;
        });
    });
});
