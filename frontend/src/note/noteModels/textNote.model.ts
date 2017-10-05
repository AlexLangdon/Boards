import { AbstractNoteModel } from './abstractNote.model';

// A note that stores a freeform text input

export class TextNoteModel extends AbstractNoteModel {
    content: string;

    constructor(values: Object = {}) {
        super(values);
    }
}
