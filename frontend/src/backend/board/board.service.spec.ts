/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BoardService } from './board.service';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, BaseRequestOptions,
    ResponseOptions, RequestMethod } from '@angular/http';
import { expect } from 'chai';
import { environment } from '../../environments/environment';
import { APIBoard } from '../apiModels/apiBoard.model';

describe('BoardService', () => {
    let service: BoardService;
    let backend: MockBackend;
    const username = 'someuser';
    const newBoard = new APIBoard({
        id: 0, title: 'boardName'
    });

    const HttpProvider = {
        provide: Http,
        useFactory: (mockBackend, defaultOptions) => {
            return new Http(mockBackend, defaultOptions);
        },
        deps: [MockBackend, BaseRequestOptions]
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
        providers: [BoardService, MockBackend,
            BaseRequestOptions, HttpProvider]
        });
    });

    beforeEach(inject([BoardService, MockBackend], (inService, mockBackend) => {
        service = inService;
        backend = mockBackend;
    }));

    it('Should create the service', () => {
        expect(service).to.be.ok;
    });

    it('Should make a get request to the correct endpoint when getting a board', () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const expected = environment.boardEndpoint + newBoard.id;
            expect(connection.request.url).to.equal(expected);
            expect(connection.request.method).to.equal(RequestMethod.Get);
        });

        service.getBoard(newBoard.id).subscribe();
    });

    it('Should return an API board when getting a board', () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const options = new ResponseOptions({body: newBoard});
            connection.mockRespond(new Response(options));
        });

        service.getBoard(newBoard.id).subscribe(resp => {
            expect(resp).to.eql(newBoard);
        });
    });

    it('Should make a post request to the correct endpoint when posting a board', () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const expected = environment.boardEndpoint + username;
            expect(connection.request.url).to.equal(expected);
            expect(connection.request.method).to.equal(RequestMethod.Post);
        });

        service.postBoard(username, newBoard.title).subscribe();
    });

    it('Should return an API board when posting a board', () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const options = new ResponseOptions({body: newBoard});
            connection.mockRespond(new Response(options));
        });

        service.postBoard(username, newBoard.title).subscribe(resp => {
            expect(resp).to.eql(newBoard);
        });
    });

    it('Should make a delete request to the correct endpoint when deleting a board', () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const expected = environment.boardEndpoint + newBoard.id;
            expect(connection.request.url).to.equal(expected);
            expect(connection.request.method).to.equal(RequestMethod.Delete);
        });

        service.deleteBoard(newBoard.id).subscribe();
    });

    it('Should return null when deleting a board', () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const options = new ResponseOptions({body: newBoard});
            connection.mockRespond(new Response(options));
        });

        service.deleteBoard(newBoard.id).subscribe((resp: any) => {
            expect(resp.ok).to.be.false;
        });
    });

    it('Should make a patch request to the correct endpoint when updating a board', () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const expected = environment.boardEndpoint + newBoard.id;
            expect(connection.request.url).to.equal(expected);
            expect(connection.request.method).to.equal(RequestMethod.Patch);
        });

        service.patchBoard(newBoard).subscribe();
    });

    it('Should return null when updating a user board', () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const options = new ResponseOptions({body: newBoard});
            connection.mockRespond(new Response(options));
        });

        service.patchBoard(newBoard).subscribe((resp: any) => {
            expect(resp.ok).to.be.false;
        });
    });
});
