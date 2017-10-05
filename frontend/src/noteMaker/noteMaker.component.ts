import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NoteItemModel } from '../noteItem/noteItem.model';
import { NoteItem } from '../noteItem/noteItem.component';
import { TextNoteCompact } from '../note/noteCompact/textNoteCompact/textNoteCompact.component';
import { TextNoteModel } from '../note/noteModels/textNote.model';
import { NoteProp } from '../note/noteModels/noteProp.model';
import { ColourPicker } from '../generic/colourPicker/colourPicker.component';

// Generates notes to add to the dashboard

@Component({
  selector: 'note-maker',
  templateUrl: './noteMaker.component.html',
  styleUrls: ['./noteMaker.component.css']
})

export class NoteMaker {
    // TODO should generate both list and text type notes
    private _newNote: TextNoteModel = new TextNoteModel();
    private _titleErrorText = '';
    private _emptyTitleError = 'Title cannot be empty';
    private _allBoards: NoteProp[] = [];

    @Input()
        // Gives the note an initial board to avoid undefinded boardId
        set allBoards(newBoards: NoteProp[]) {
            this._allBoards = newBoards;
            this._newNote.board = this._allBoards[0];
        }

        get allBoards() {
            return this._allBoards;
        }

    @Input()
        allTags: NoteProp[] = [];

    @Output()
        noteAdded: EventEmitter<TextNoteModel> = new EventEmitter();

    noteDone() {
        if (!this._newNote.title) {
            this._titleErrorText = this._emptyTitleError;
            return;
        }

        this.noteAdded.emit(this._newNote);
        this.resetNote();
    }

    resetNote() {
        this._titleErrorText = '';
        this._newNote = new TextNoteModel();
        this._newNote.board = this._allBoards[0];
    }

    updateNote(note: TextNoteModel) {
        this._newNote = note;
    }

    updateNoteBoard(board: NoteProp) {
        this._newNote.board = board;
    }

    addTag(tag: NoteProp) {
        this._newNote.addTag(tag);
    }

    removeTagById(tagId: number) {
        this._newNote.removeTagById(tagId);
    }

    updateColour(colour: string) {
        this._newNote.colour = colour;
    }

    get newNote(): TextNoteModel {
        return this._newNote;
    }

    get noteColours() {
        return TextNoteModel.NOTE_COLOURS;
    }

    errorMatcher() {
        return this._titleErrorText !== '';
    }

    get titleErrorText() {
        return this._titleErrorText;
    }
}
