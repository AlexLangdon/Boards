import { Component, OnInit } from '@angular/core';
import { NoteMaker } from '../noteMaker/noteMaker.component';
import { NoteService } from '../backend/note/note.service';
import { UserService } from '../backend/user/user.service';
import { BoardService } from '../backend/board/board.service';
import { AbstractNoteModel } from '../note/noteModels/abstractNote.model';
import { TextNoteModel } from '../note/noteModels/textNote.model';
import { TextNoteCompact } from '../note/noteCompact/textNoteCompact/textNoteCompact.component';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { FilterGroup } from '../filterObjects/filterGroup/filterGroup.component';
import { FilterModel } from '../filterObjects/filterModel/filter.model';
import { MdDialog } from '@angular/material';
import { authVars } from '../environments/authVars';
import { APIBoard } from '../backend/apiModels/apiBoard.model';
import { APINote } from '../backend/apiModels/apiNote.model';
import { APITag } from '../backend/apiModels/apiTag.model';
import { NoteProp } from '../note/noteModels/noteProp.model';

// Main app screen

const USERNAME = authVars.username;

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    viewProviders: [DragulaService]
})
export class Dashboard {

    //TODO Could use a separate store component
    private _notes: AbstractNoteModel[] = [];

    boardFilters: FilterModel[] = [];
    tagFilters: FilterModel[] = [];

    constructor(private _boardsService: BoardService,
                private _userService: UserService,
                private _noteService: NoteService,
                private _dragulaService: DragulaService,
                public dialog: MdDialog) {
        // Set the dragula service to only respond to drags on "draggable" class html
        _dragulaService.setOptions('note-bag', {
            revertOnSpill: true,
            moves: function (el, container, target) {
                if (target.classList) {
                    return target.classList.contains('note-draggable');
                }
                return false;
            }
        });
    }

    // Called after constructor
    public ngOnInit() {
        this._userService.getBoards(USERNAME)
            .subscribe(boards => {
                for (const board of boards) {
                    // Add board as a filter object
                    // NOTE - must assign a new board store reference here with concat
                    //  for Angular to update the UI
                    this.boardFilters = this.boardFilters.concat(board.toFilterModel());
                    // Get all notes from this board
                    this._noteService.getBoardNotes(board.id)
                        .subscribe(notes => notes.map(note => {
                            this._notes =  this._notes.concat(note.toTextNote());
                        }));
                }
            });

        this._userService.getTags(USERNAME)
            .subscribe(tags => {
            for (const tag of tags) {
                this.tagFilters = this.tagFilters.concat(tag.toFilterModel());
            }
        });
    }

    addNote(note: TextNoteModel) {
        this._noteService.postNote(new APINote(note))
            .subscribe(newNote => {
                this._notes = this._notes.concat(newNote.toTextNote());
            });
    }

    deleteNote(noteId: number, noteBoardId: number) {
        this._noteService.deleteNote(noteBoardId, noteId)
            .subscribe(_ => {
                this._notes = this._notes.filter((note => note.id !== noteId));
            });
    }

    updateNote(updatedNote: TextNoteModel) {
        this._noteService.patchNote(new APINote(updatedNote))
            .subscribe(_ => {
                const index = this._notes.findIndex(note => note.id === updatedNote.id);
                this._notes[index] = updatedNote;
            });
    }

    // Used for orderring notes based on their index
    noteTracker(index: number, note: AbstractNoteModel) {
        return note ? note.index : undefined;
    }

    getActiveFilters(filters: FilterModel[]) {
        return filters.filter(f => f.active);
    }

    setActiveFilters(activeFilterStrings: string[], targetFilterSet: FilterModel[]) {
        targetFilterSet.forEach(filter =>
            filter.active = activeFilterStrings.indexOf(filter.name) > -1);
    }

    replaceFiltersInSet(updatedFilter: FilterModel, filterSet: FilterModel[]) {
        return filterSet.map(filter => {
            return filter.id === updatedFilter.id ? updatedFilter : filter;
        });
    }

    // Checks if a note does not match the active filters
    filteredOut(note: AbstractNoteModel) {
        // return note.board.name !== 'board1';
        const matchActiveBoard = this.boardFilters.find(filter => filter.id === note.board.id).active;
        const noBoardsActive = this.boardFilters.filter(filter => filter.active).length === 0;
        const activeTags = this.tagFilters.filter(filter => filter.active);
        const matchActiveTag = activeTags.some(filter => note.tags.some(tag => tag.id === filter.id));
        const noTagsActive = activeTags.length === 0;

        // Show the note if its board is active or if its tag is active
        // If no tags (or boards) are active then assume all tags (or boards) shown
        return !((matchActiveBoard || noBoardsActive) && (matchActiveTag || noTagsActive));
    }

    addBoard(boardName: string) {
        this._boardsService.postBoard(USERNAME, boardName)
            .subscribe(board => {
                this.boardFilters = this.boardFilters.concat(board.toFilterModel());
            });
    }

    updateBoard(newBoard: NoteProp) {
        this._boardsService.patchBoard(new APIBoard(newBoard))
            .subscribe(_ => {
                const index = this.boardFilters.findIndex(board => board.id === newBoard.id);
                this.boardFilters[index].name = newBoard.name;
                // Update notes that have this board
                this._notes.forEach(note => {
                    if (note.board.id === newBoard.id) {
                        note.board = newBoard;
                    }
                });
            });
    }

    deleteBoardById(boardId: number) {
        this._boardsService.deleteBoard(boardId)
            .subscribe(_ => {
                this.boardFilters = this.boardFilters.filter(board => board.id !== boardId);
                // Delete all notes that are on this board
                this._notes = this._notes.filter(note => note.board.id !== boardId);
            });
    }

    addTag(tagName: string) {
        this._userService.putTag(USERNAME, tagName)
            .subscribe(tag => {
                this.tagFilters = this.tagFilters.concat(tag.toFilterModel());
            });
    }

    updateTag(newTag: NoteProp) {
        // Check if tag id exists
        const index = this.tagFilters.findIndex(tag => tag.id === newTag.id);
        if (index < 0) { return; }
        const oldName = this.tagFilters[index].name;
        this._userService.patchTag(USERNAME, newTag.id, new APITag(newTag))
            .subscribe(_ => {
                this.tagFilters[index].name = newTag.name;
                // Update notes that have this tag
                this._notes.forEach(note => {
                    const indexOfTag = note.tags.findIndex(tag => tag.id === newTag.id);
                    if (indexOfTag > -1) {
                        note.tags[indexOfTag] = newTag;
                    }
                });
            });
    }

    deleteTagById(tagId: number) {
        this._userService.deleteTag(USERNAME, tagId)
            .subscribe(_ => {
            this.tagFilters = this.tagFilters.filter(tag => tag.id !== tagId);
                // Update notes that have this tag
                this._notes.forEach(note => {
                    const indexOfTag = note.tags.findIndex(tag => tag.id === tagId);
                    if (indexOfTag > -1) {
                        note.tags.splice(indexOfTag, 1);
                    }
                });
            });
    }

    get notes(): AbstractNoteModel[] {
        return this._notes;
    }
}
