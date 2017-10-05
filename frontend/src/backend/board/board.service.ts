import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { NoteProp } from '../../note/noteModels/noteProp.model';
import { APIBoard } from '../apiModels/apiBoard.model';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const BOARDS_EP = environment.boardEndpoint;

// Manages boards for a given user

@Injectable()
export class BoardService {

    constructor(private http: Http) {}

    public getBoard(boardId: number): Observable<APIBoard> {
        return this.http.get(BOARDS_EP + boardId)
            .map(resp => { return new APIBoard(resp.json()) })
            .catch(this.handleError);
    }

    public postBoard(username: string, boardName: string): Observable<APIBoard> {
        return this.http.post(BOARDS_EP + username, new APIBoard({title: boardName}))
            .map(resp => { return new APIBoard(resp.json()) })
            .catch(this.handleError);
    }

    public deleteBoard(boardId: number): Observable<null> {
        return this.http.delete(BOARDS_EP + boardId)
            .catch(this.handleError);
    }

    public patchBoard(board: APIBoard): Observable<null> {
        return this.http.patch(BOARDS_EP + board.id, board)
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        console.error('UserService::handleError', error);
        return Observable.throw(error);
    }
}
