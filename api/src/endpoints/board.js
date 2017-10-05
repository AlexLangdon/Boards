"use strict";

const api = require("../api/api");
const models = require("../db/models");

const getBoard = api.createEndpoint((ep) => {
        ep.params.need("boardId");
        ep.main(async (req) => {
            const board = await models.Board.findById(parseInt(req.params.boardId, 10));
            // TODO: Security checks that the board is owned by subject user.
            if(board) {
                return [200, board.get({plain: true})];
            }

            return 404;
    });
});

const postBoard = api.createEndpoint((ep) => {
    // Create new board
    ep.params.need("username");
    ep.body.need("title");
    ep.main(async (req) => {
        // TODO: Add User owner from creator token.
        // TODO: Check if such a board exists already
        const user = await models.User.findAll({where: {username: req.params.username }});

        if(user.length !== 1) {
            return 404;
        }

        const boardQueryParam = {title: req.body.title, deleted: false};
        let board = await models.Board.findAll({where: boardQueryParam});

        if(board.length === 0) {
            board = await models.Board.create(boardQueryParam);
        } else {
            board = board[0];
        }

        await user[0].addBoard(board);
        
        return [201, board.get({plain: true})];
    });
});

const deleteBoard = api.createEndpoint((ep) => {
    ep.params.need("boardId");
    // TODO: Security checking
    ep.main(async (req) => {
        const board = await models.Board.findById(parseInt(req.params.boardId, 10));

        if(board) {
            if(board.deleted) {
                return [409, "Cannot delete board that is already deleted"];
            }

            board.deleted = true;
            await board.save();
            return 200;
        }
        
        return 404;
    });
});

const patchBoard = api.createEndpoint((ep) => {
    ep.params.need("boardId");
    ep.body.need("title");
    // TODO: Security checking
    ep.main(async (req) => {
        const board = await models.Board.findById(parseInt(req.params.boardId, 10));

        if(!board) {
            return 404;
        }

        if(board.deleted) {
            return [409, "Cannot patch a deleted board"]
        }

        const boardQueryParam = {title: req.body.title, deleted: false};
        const sameBoards = await models.Board.findAll({where: boardQueryParam});
        
        if(sameBoards.length > 0) {
            return [409, "A board with that title already exists"]
        }
        
        await models.Board.update(boardQueryParam, 
            {where: {id: req.params.boardId}});

        return 204;
    });
});

module.exports = {
    getBoard: getBoard,
    postBoard: postBoard,
    deleteBoard: deleteBoard,
    patchBoard: patchBoard
};
