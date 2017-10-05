import { NoteProp } from './noteProp.model';

// Parent class to encapsulate all types of notes

export abstract class AbstractNoteModel {
     static readonly NOTE_COLOURS = [
        'ffffff',
        'ef9a9a',
        'ffcc80',
        'fff59d',
        'c5e1a5',
        '80deea',
        '90caf9',
        'b0bec5'
    ];

    id: number;
    title: string;
    // TODO Should change the index when persisting order of notes is possible
    index = 0;
    board: NoteProp;
    tags: NoteProp[] = [];
    colour = AbstractNoteModel.NOTE_COLOURS[0];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    //Add tag if no such tag id is stored
    addTag(tag: NoteProp) {
        if (!this.tags.some(t => t.id === tag.id)) {
            this.tags = this.tags.concat(tag);
        }
    }

    removeTagById(tagId: number) {
        this.tags = this.tags.filter(t => t.id !== tagId);
    }
}
