export class NoteItemModel {
    id: number;
    index: number;
    content: string;
    complete: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}