import {Input, Output, EventEmitter } from '@angular/core';
import { AbstractNoteModel } from '../noteModels/abstractNote.model';
import { NoteProp } from '../noteModels/noteProp.model';
import { DropdownSelect } from '../../generic/dropdown/dropdownSelect/dropdownSelect.component';
import { TagList } from '../../tagList/tagList.component';
import { ColourPicker } from '../../generic/colourPicker/colourPicker.component';
import { FilterModel } from '../../filterObjects/filterModel/filter.model';

// Encapsulates all note display components

export class AbstractNoteCompact {

    // The position of the note in the board
    // TODO Should be integrated into dragula re-orderring and database records
    private _index: number;

    @Input()
        noteModel: AbstractNoteModel;

    @Input()
        set index(i: number) {
            this._index = i;
            this.noteModel.index = i;
            this.updateNote.emit(this.noteModel);
        }

        get index(): number {
            return this._index;
        }

    @Input()
        allBoards: NoteProp[] = [];

    @Input()
        allTags: NoteProp[] = [];

    @Output()
        deleteNoteById = new EventEmitter<number>();

    // Should emit whenever the note is changed
    @Output()
        updateNote = new EventEmitter<AbstractNoteModel>();

    deleteThisNote() {
        this.deleteNoteById.emit(this.noteModel.id);
    }

    updateBoard(board: NoteProp) {
        if (board.id !== this.noteModel.board.id) {
            this.noteModel.board = board;
            this.updateNote.emit(this.noteModel);
        }
    }

    addTag(tag: NoteProp) {
        this.noteModel.addTag(tag);
        this.updateNote.emit(this.noteModel);
    }

    removeTagById(tagId: number) {
        this.noteModel.removeTagById(tagId);
        this.updateNote.emit(this.noteModel);
    }

    updateColour(colour: string) {
        this.noteModel.colour = colour;
        this.updateNote.emit(this.noteModel);
    }

    get noteColours() {
        return AbstractNoteModel.NOTE_COLOURS;
    }
}
