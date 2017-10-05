/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NoteService } from './note.service';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, BaseRequestOptions,
    ResponseOptions, RequestMethod } from '@angular/http';
import { expect } from 'chai';
import { environment } from '../../environments/environment';
import { APINote } from '../apiModels/apiNote.model';
import { NoteProp } from '../../note/noteModels/noteProp.model';

describe('NoteService', () => {
    let service: NoteService;
    let backend: MockBackend;
    const newNote = new APINote({id: 0, title: 'title0', boardId: 0,
        board: {id: 0, title: 'board0'},
        content: 'content0',
        colour: 'ffffff',
        archived: false,
        tags: []
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
        providers: [NoteService, MockBackend,
            BaseRequestOptions, HttpProvider]
        });
    });

    beforeEach(inject([NoteService, MockBackend], (inService, mockBackend) => {
        service = inService;
        backend = mockBackend;
    }));

    it('Should create the service', () => {
        expect(service).to.be.ok;
    });

    it('Should make a post request to the correct endpoint when posting a note', () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const expected = environment.boardEndpoint + newNote.boardId + '/notes';
            expect(connection.request.url).to.equal(expected);
            expect(connection.request.method).to.equal(RequestMethod.Post);
            expect(connection.request.headers.get('Content-Type')).to.equal('application/json');
        });

        service.postNote(newNote).subscribe();
    });

    it('Should return a successfuly posted note', () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const options = new ResponseOptions({body: newNote});
            connection.mockRespond(new Response(options));
        });

        service.postNote(newNote).subscribe(resp => {
            expect(resp).to.eql(newNote);
        });
    });

    it('Should make a get request to the correct endpoint when getting the board notes', () => {
        const boardId = 0;

        backend.connections.subscribe((connection: MockConnection) => {
            const expected = environment.boardEndpoint + boardId + '/notes';
            expect(connection.request.url).to.equal(expected);
            expect(connection.request.method).to.equal(RequestMethod.Get);
        });

        service.getBoardNotes(boardId).subscribe();
    });

    it('Should return an API note array when getting the board notes', () => {
        const boardId = 0;
        const expectedNotes: APINote[] = [
            new APINote({id: 0, title: 'title0', boardId: 0,
                board: {id: 0, title: 'board0'},
                content: 'content0',
                colour: 'ffffff',
                archived: false,
                tags: []
            }),
            new APINote({id: 1, title: 'title1', boardId: 1,
                board: {id: 0, title: 'board0'},
                content: 'content1',
                colour: 'ffffff',
                archived: false,
                tags: [
                    new NoteProp(0, 'tag0'),
                    new NoteProp(1, 'tag1'),
                ]
            }),
        ];

        backend.connections.subscribe((connection: MockConnection) => {
            const options = new ResponseOptions({body: expectedNotes});
            connection.mockRespond(new Response(options));
        });

        service.getBoardNotes(boardId).subscribe(resp => {
            expect(resp).to.eql(expectedNotes);
        });
    });

    it('Should make a delete request to the correct endpoint when deleting a note', () => {
        const boardId = 0;
        const noteId = 0;

        backend.connections.subscribe((connection: MockConnection) => {
            const expected = environment.boardEndpoint + boardId + '/notes/' + noteId;
            expect(connection.request.url).to.equal(expected);
            expect(connection.request.method).to.equal(RequestMethod.Delete);
        });

        service.deleteNote(boardId, noteId).subscribe();
    });

    it('Should return no output when deleting a note', () => {
        const boardId = 0;
        const noteId = 0;

        backend.connections.subscribe((connection: MockConnection) => {
            const options = new ResponseOptions({body: newNote});
            connection.mockRespond(new Response(options));
        });

        service.deleteNote(boardId, noteId).subscribe((resp: Response) => {
            expect(resp.ok).to.be.false;
        });
    });

    it('Should make a patch request to the correct endpoint when patching a note', () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const expected = environment.boardEndpoint + newNote.boardId + '/notes/' + newNote.id;
            expect(connection.request.url).to.equal(expected);
            expect(connection.request.method).to.equal(RequestMethod.Patch);
            const options = new ResponseOptions({body: newNote});
            connection.mockRespond(new Response(options));
        });

        service.patchNote(newNote).subscribe();
    });

    it('Should return no output when patching a note', () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const options = new ResponseOptions({body: newNote});
            connection.mockRespond(new Response(options));
        });

        service.patchNote(newNote).subscribe((resp: Response) => {
            expect(resp.ok).to.be.false;
        });
    });
});
