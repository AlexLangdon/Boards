import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NoteItemModel } from '../noteItem/noteItem.model';
import { NoteItem } from '../noteItem/noteItem.component';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { TextNoteCompact } from '../note/noteCompact/textNoteCompact/textNoteCompact.component';
import { ListNoteModel } from '../note/noteModels/listNote.model';
import { FilterModel } from '../filterObjects/filterModel/filter.model';

// A note maker for list type notes - unimplemented

// @Component({
//   selector: 'list-note-maker',
//   templateUrl: './noteMaker.component.html',
//   styleUrls: ['./noteMaker.component.css'],
//   viewProviders: [DragulaService]
// })

// export class ListNoteMaker {
    // TODO should generate both list and text type notes
    //  private _newNote: ListNoteModel = new ListNoteModel();

    // @Input()
    //     allBoards: string[] = [];

    // @Input()
    //     allTags: string[] = [];

    // @Output()
    //     noteAdded: EventEmitter<ListNoteModel> = new EventEmitter();

    // constructor(private _dragulaService: DragulaService) {
    //     _dragulaService.setOptions('note-maker-bag', {
    //         revertOnSpill: true
    //     });
    // }

    // // Add item if input box not empty. Else add the current note
    // entryAddClicked(entry: string) {
    //     if (entry.length > 0) {
    //         this._newNote.addToContents(entry);
    //     } else {
    //         this.noteAdded.emit(this._newNote);
    //         this._newNote = new ListNoteModel();
    //     }
    // }

    // removeItem(id: number) {
    //     this._newNote.removeItemById(id);
    // }

    // updateItem(item: NoteItemModel) {
    //     // New item replaces current items in the new note with the same id
    //     this._newNote.content.map(i => i.id === item.id ? item : i);
    // }

    // removeNote() {
    //     this._newNote.content = [];
    // }

    // updateNote(note: ListNoteModel) {
    //     this._newNote = note;
    // }

    // updateNoteBoard(newBoard: FilterModel) {
    //     this._newNote.board = newBoard;
    // }

    // addTag(tag: string) {
    //     this._newNote.addTag(tag);
    // }

    // removeTag(tagId: number) {
    //     this._newNote.removeTagById(tagId);
    // }

    // itemTracker(index: number, item: NoteItemModel) {
    //     return item ? item.index : undefined;
    // }

    // get newNote(): ListNoteModel {
    //     return this._newNote;
    // }
// }