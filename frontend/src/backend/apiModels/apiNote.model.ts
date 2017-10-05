import { TextNoteModel } from '../../note/noteModels/textNote.model';
import { NoteProp } from '../../note/noteModels/noteProp.model';

// Model for sending notes between the front and backend

export class APINote {
    id: number;
    boardId: number;
    board: {
        id: number;
        title: string;
    };
    title: string;
    content: string;
    colour: string;
    archived: boolean;
    tags: {
      id: number;
      name: string;
    }[];

    constructor(values: Object = {}) {
      if (values instanceof TextNoteModel) {
        Object.assign(this, values);
        this.boardId = values.board.id;
        this.board.id = values.board.id;
        this.board.title = values.board.name;
      } else {
        Object.assign(this, values);
      }
    }

    toTextNote(): TextNoteModel {
      const noteTags = this.tags.map(tag => { return new NoteProp(tag.id, tag.name) });
      const noteValsObj = {
        id: this.id,
        title: this.title,
        board: new NoteProp(this.board.id, this.board.title),
        tags: noteTags,
        content: this.content,
        colour: this.colour
      };

      return new TextNoteModel(noteValsObj);
    }
}
