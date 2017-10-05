import { FilterModel } from '../../filterObjects/filterModel/filter.model';

// Model for sending tags between the front and backend

export class APITag {
    id: number;
    name: string;

    constructor(values: Object = {}) {
      Object.assign(this, values);
    }

    toFilterModel(): FilterModel {
        return new FilterModel(this.id, this.name);
    }
}
