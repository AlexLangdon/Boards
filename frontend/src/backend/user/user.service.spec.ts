/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserService } from './user.service';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, BaseRequestOptions,
    ResponseOptions, RequestMethod } from '@angular/http';
import { expect } from 'chai';
import { environment } from '../../environments/environment';
import { APITag } from '../apiModels/apiTag.model';
import { APIBoard } from '../apiModels/apiBoard.model';

describe('UserService', () => {
    let service: UserService;
    let backend: MockBackend;
    const username = 'someuser';
    const newTag = new APITag({
        id: 0, name: 'tagName'
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
        providers: [UserService, MockBackend,
            BaseRequestOptions, HttpProvider]
        });
    });

    beforeEach(inject([UserService, MockBackend], (inService, mockBackend) => {
        service = inService;
        backend = mockBackend;
    }));

    it('Should create the service', () => {
        expect(service).to.be.ok;
    });

    it('Should make a get request to the correct endpoint when getting boards', () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const expected = environment.userEndpoint + username + '/boards';
            expect(connection.request.url).to.equal(expected);
            expect(connection.request.method).to.equal(RequestMethod.Get);
        });

        service.getBoards(username).subscribe();
    });

    it('Should return an API board array when getting user boards', () => {
        const expectedBoards = [
            new APIBoard({id: 0, title: 'board0'}),
            new APIBoard({id: 1, title: 'board1'}),
        ];

        backend.connections.subscribe((connection: MockConnection) => {
            const options = new ResponseOptions({body: expectedBoards});
            connection.mockRespond(new Response(options));
        });

        service.getBoards(username).subscribe(resp => {
            expect(resp).to.eql(expectedBoards);
        });
    });

    it('Should make a get request to the correct endpoint when getting user tags', () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const expected = environment.userEndpoint + username + '/tags';
            expect(connection.request.url).to.equal(expected);
            expect(connection.request.method).to.equal(RequestMethod.Get);
        });

        service.getTags(username).subscribe();
    });

    it('Should return an API board array when getting user tags', () => {
        const expectedTags = [
            new APITag({id: 0, title: 'tag0'}),
            new APITag({id: 1, title: 'tag1'}),
        ];

        backend.connections.subscribe((connection: MockConnection) => {
            const options = new ResponseOptions({body: expectedTags});
            connection.mockRespond(new Response(options));
        });

        service.getTags(username).subscribe(resp => {
            expect(resp).to.eql(expectedTags);
        });
    });

    it('Should make a put request to the correct endpoint when putting a user tag', () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const expected = environment.userEndpoint + username + '/tags/' + newTag.name;
            expect(connection.request.url).to.equal(expected);
            expect(connection.request.method).to.equal(RequestMethod.Put);
        });

        service.putTag(username, newTag.name).subscribe();
    });

    it('Should return a tag when putting a user tag', () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const options = new ResponseOptions({body: newTag});
            connection.mockRespond(new Response(options));
        });

        service.putTag(username, newTag.name).subscribe(resp => {
            expect(resp).to.eql(newTag);
        });
    });

    it('Should make a patch request to the correct endpoint when updating a user tag', () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const expected = environment.userEndpoint + username + '/tags/' + newTag.id;
            expect(connection.request.url).to.equal(expected);
            expect(connection.request.method).to.equal(RequestMethod.Patch);
        });

        service.patchTag(username, newTag.id, newTag).subscribe();
    });

    it('Should return null when updating a user tag', () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const options = new ResponseOptions({body: newTag});
            connection.mockRespond(new Response(options));
        });

        service.patchTag(username, newTag.id, newTag).subscribe((resp: any) => {
            expect(resp.ok).to.be.false;
        });
    });

    it('Should make a delete request to the correct endpoint when deleting a user tag', () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const expected = environment.userEndpoint + username + '/tags/' + newTag.id;
            expect(connection.request.url).to.equal(expected);
            expect(connection.request.method).to.equal(RequestMethod.Delete);
        });

        service.deleteTag(username, newTag.id).subscribe();
    });

    it('Should return null when deleting a user tag', () => {
        backend.connections.subscribe((connection: MockConnection) => {
            const options = new ResponseOptions({body: newTag});
            connection.mockRespond(new Response(options));
        });

        service.deleteTag(username, newTag.id).subscribe((resp: any) => {
            expect(resp.ok).to.be.false;
        });
    });
});
