"use strict";
const api = require("../api/api");
const models = require("../db/models");

const getNotes = api.createEndpoint((ep) => {
    ep.params.need("boardId");
    ep.main(async (req) => {
        // Returns notes in the given board
        const notes = await models.Note.findAll({where: {boardId: req.params.boardId}});
        let noteTags = new Array(notes.length);

        // Includes the associated board 
        const board = await models.Board.findById(parseInt(req.params.boardId, 10));

        // Also includes any tags associated with a given note
        for(let i = 0; i < notes.length; i++) {
            notes[i].tags = await notes[i].getTags();
        }

        if(notes) {
            return [200, notes.map(t => {
                const note = t.get({plain: true});
                note.content = note.content ? note.content.toString('utf-8') : '';
                note.board = board;
                note.tags = t.tags;
                return note;
            })];
        }

        return 404;
    });
});

const postNote = api.createEndpoint((ep) => {
    // Create new note
    ep.params.need("boardId");
    ep.body.need("title");
    ep.main(async (req) => {
        // Check note board exists in the database
        const board = await models.Board.findById(parseInt(req.params.boardId, 10));
        if(!board) {
            return 400;
        }

        const tagsToAdd = [];

        // Check all tags given to the note exists in the database
        for(let tag of req.body.tags) {
            const tagFound = await models.Tag.findById(parseInt(tag.id, 10));
            if(!tag) {
                return 400;
            }
            tagsToAdd.push(tagFound);
        }

        const note = await models.Note.create(
            {
                boardId: req.params.boardId,
                title: req.body.title,
                content: req.body.content,
                colour: req.body.colour,
                archived: false
            });
        
        note.addTags(tagsToAdd);
        
        const noteResp = note.get({plain: true});
        noteResp.board = board;
        noteResp.tags = tagsToAdd;

        return [201, noteResp];
    });
});

const deleteNote = api.createEndpoint((ep) => {
    ep.params.need("noteId");
    ep.main(async (req) => {
    models.Note.destroy({where: {id: req.params.noteId}})
        .then(deletedFlag => {
            if(deletedFlag === 1){
                // Note deleted
                return 200;      
            } else {
                // Note not found
                return 404;
            }
        });
    });
});

const patchNote = api.createEndpoint((ep) => {
    // Update note
    ep.params.need("noteId");
    ep.body.need("title");
    ep.main(async (req) => {
        // Check the note exists
        const noteBefore = await models.Note.findById(parseInt(req.params.noteId, 10));
        if(!noteBefore) {
            return 400;
        }

        // Check note board exists in the database
        const board = await models.Board.findById(parseInt(req.params.boardId, 10));
        if(!board) {
            return 400;
        }

        const tagsToSet = [];

        // Check all tags given to the note exists in the database
        for(let tag of req.body.tags) {
            const tagFound = await models.Tag.findById(parseInt(tag.id, 10));
            if(!tag) {
                return 400;
            }
            tagsToSet.push(tagFound);
        }

        await models.Note.update({
                boardId: req.params.boardId,
                title: req.body.title,
                content: req.body.content,
                colour: req.body.colour,
            }, {where: {id: req.params.noteId}});

        const noteAfter = await models.Note.findById(parseInt(req.params.noteId, 10));
        noteAfter.setTags(tagsToSet);

        return 204;
    });
});

module.exports = {
    getNotes: getNotes,
    postNote: postNote,
    deleteNote: deleteNote,
    patchNote: patchNote
};
