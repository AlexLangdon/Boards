import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { APITag } from '../apiModels/apiTag.model';
import { APIBoard } from '../apiModels/apiBoard.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

// Manages tags for a given user

const USER_EP = environment.userEndpoint;

@Injectable()
export class UserService {

    constructor(private http: Http) {}

    public getBoards(username: string): Observable<APIBoard[]> {
        return this.http.get(USER_EP + username + '/boards')
            .map(resp => resp.json().map(respElem => {
                return new APIBoard(respElem)
            })).catch(this.handleError);
    }

    public getTags(username: string): Observable<APITag[]> {
        return this.http.get(USER_EP + username + '/tags')
            .map(resp => resp.json().map(respElem => {
                return new APITag(respElem)
            })).catch(this.handleError);
    }

    public putTag(username: string, tagName: string): Observable<APITag> {
        return this.http.put(USER_EP + username + '/tags/' + tagName, null)
            .map(resp => { return new APITag(resp.json()) })
            .catch(this.handleError);
    }

    public patchTag(username: string, tagId: number, newTag: APITag): Observable<null> {
        return this.http.patch(USER_EP + username + '/tags/' + tagId, newTag)
            .catch(this.handleError);
    }

    public deleteTag(username: string, tagId: number): Observable<null> {
        return this.http.delete(USER_EP + username + '/tags/' + tagId)
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        console.error('UserService::handleError', error);
        return Observable.throw(error);
    }
}
