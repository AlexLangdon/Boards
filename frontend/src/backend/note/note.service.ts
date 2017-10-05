import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { NoteProp } from '../../note/noteModels/noteProp.model';
import { environment } from '../../environments/environment';
import { APINote } from '../apiModels/apiNote.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

// Manages notes for a given user

const BOARD_EP = environment.boardEndpoint;

@Injectable()
export class NoteService {

  constructor(private http: Http) {}

  public postNote(note: APINote): Observable<APINote> {
    const body = JSON.stringify(note);
    const options = new RequestOptions({
      headers: new Headers({
        'Content-Type' : 'application/json',
        'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Access-Control-Allow-Headers':
          'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      })
    });

    return this.http.post(BOARD_EP + note.boardId + '/notes', note, options)
      .map(resp => { return new APINote(resp.json()) })
      .catch(this.handleError);
  }

  public getBoardNotes(boardId: number): Observable<APINote[]> {
    return this.http.get(BOARD_EP + boardId + '/notes')
      .map(resp => resp.json().map(respElem => { return new APINote(respElem) }))
      .catch(this.handleError);

      // TODO Sort the notes by index if they should be draggable
      // .map(resp => {
      //   const notes = resp.json().sort((n1,n2) => n1.index - n2.index);
      //   return notes.map((note) => new NoteModel(note));
      // })
      // .catch(this.handleError);
  }

  public deleteNote(boardId: number, noteId: number): Observable<null> {
    return this.http.delete(BOARD_EP + boardId + '/notes/' + noteId)
      .catch(this.handleError);
  }

  public patchNote(note: APINote): Observable<null> {
    return this.http.patch(BOARD_EP + note.board.id + '/notes/' + note.id, note)
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    console.error('NoteService::handleError', error);
    return Observable.throw(error);
  }
}
