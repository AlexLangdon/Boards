import { FilterModel } from '../../filterObjects/filterModel/filter.model';
import { NoteProp } from '../../note/noteModels/noteProp.model';

// Model for sending boards between the front and backend

export class APIBoard {
    id: number;
    title: string;
    deleted: boolean;

    constructor(values: Object = {}) {
        if (values instanceof NoteProp) {
            Object.assign(this, values);
            this.id = values.id;
            this.title = values.name;
            this.deleted = false;
        } else {
            Object.assign(this, values);
        }
    }

    toFilterModel(): FilterModel {
        return new FilterModel(this.id, this.title);
    }
}
