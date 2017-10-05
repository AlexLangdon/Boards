import { NoteProp } from '../../note/noteModels/noteProp.model';

// A togglable tag/board filter

export class FilterModel extends NoteProp {
    active: boolean;

    constructor(id: number, name: string, active = false) {
        super(id, name);
        this.active = active;
    }
}
