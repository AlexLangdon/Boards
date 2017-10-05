import { AbstractNoteModel } from './abstractNote.model';
import { NoteItemModel } from '../../noteItem/noteItem.model';

// A model for notes that have a list of items - under development

export class ListNoteModel extends AbstractNoteModel {
    content: NoteItemModel[];

    constructor(values: Object = {}) {
        super(values);
        if (this.content) {
            this.content = this.content.sort((i1, i2) => i1.index - i2.index);
        } else {
            this.content = [];
        }
    }

    addToContents(newEntry: string) {
        // TODO emit an update event to the dashboard
        // const newItem = new NoteItemModel({
        //     id: this._nextId,
        //     index: this.content.length,
        //     contents: newEntry,
        //     complete: false
        // });
        // this.content.push(newItem);
    }

    updateItem(item: NoteItemModel) {
        // Update item if its id is in the list
        this.content = this.content.map(i => i.id === item.id ? item : i);
    }

    removeItemById(id: number) {
        this.content = this.content.filter((item => item.id !== id));
    }
}
