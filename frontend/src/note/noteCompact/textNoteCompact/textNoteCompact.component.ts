import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AbstractNoteCompact } from '../abstractNoteCompact.component';
import { TextNoteModel } from '../../noteModels/textNote.model';

// Component for showing a text model note

@Component({
    selector: 'text-note',
    templateUrl: './textNoteCompact.component.html',
    styleUrls: ['./textNoteCompact.component.css']
})
export class TextNoteCompact extends AbstractNoteCompact {

    @Input()
        noteModel: TextNoteModel;

    @Output()
        updateNote = new EventEmitter<TextNoteModel>();

    endContentEdit(newNoteContent) {
        this.noteModel.content = newNoteContent.value;
        this.updateNote.emit(this.noteModel);
    }
}
