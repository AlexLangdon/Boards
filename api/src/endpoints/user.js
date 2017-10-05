"use strict";
const api = require("../api/api");
const models = require("../db/models");

const getUserBoards = api.createEndpoint((ep) => {
    // ep.security.needs.permission("boards_dev").or.subject(ep.params.username);
    ep.params.need("username");
    ep.main(async (req) => {
        // Return boards owned by this user.
        const user = await models.User.findAll({where: {username: req.params.username}});
        if(user.length !== 1) {
            return 404;
        }

        const boards = (await user[0].getBoards()).filter(b => !b.deleted);
        return [200, boards.map(b => b.get({plain: true}))];
    });
});

const getUserTags = api.createEndpoint((ep) => {
    // ep.security.needs.permission("boards_dev").or.subject(ep.params.username);
    ep.params.need("username");

    ep.main(async (req) => {
        const user = await models.User.findAll({where: {username: req.params.username }});
        if(user.length !== 1) {
            return 404;
        }

        const tags = await user[0].getTags();
        return [200, tags.map(t => t.get({plain: true}))];
    });
});

const putUserTag = api.createEndpoint((ep) => {
    // ep.security.needs.permission("boards_dev").or.subject(ep.params.username);
    ep.params.need("username");
    ep.params.need("tagName");

    ep.main(async (req) => {
        const user = await models.User.findAll({where: {username: req.params.username }});
        let tag = await models.Tag.findAll({where: {name: req.params.tagName }});

        if(user.length !== 1) {
            return 404;
        }

        if(tag.length === 0) {
           tag = await models.Tag.create({ name: req.params.tagName });
        } else {
            tag = tag[0];
        }

        await user[0].addTag(tag);
        return [200, tag.get({plain: true})];
    });
});

const deleteUserTag = api.createEndpoint((ep) => {
    // ep.security.needs.permission("boards_dev").or.subject(ep.params.username);
    ep.params.need("username");
    ep.params.need("tagId");
    ep.main(async (req) => {
        const user = await models.User.findAll({where: {username: req.params.username}});
        const tag = await models.Tag.findById(parseInt(req.params.tagId, 10));

        if(user.length !== 1 || !tag) {
            return 404;
        }

        models.Tag.destroy({where: {id: req.params.tagId}})
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

const patchUserTag = api.createEndpoint((ep) => {
    // ep.security.needs.permission("boards_dev").or.subject(ep.params.username);
    ep.params.need("username");
    ep.params.need("tagId");
    ep.body.need("name");
    ep.main(async (req) => {
        const users = await models.User.findAll({where: {username: req.params.username}});

        if(users.length !== 1) {
            return 404;
        }

        const tagToReplace = await users[0].getTags({where: {id: req.params.tagId}});

        if(tagToReplace.length !== 1) {
            return 404;
        }

        // Should not make duplicate tags
        const newTagParams = {name: req.body.name}
        const duplicateTags = await users[0].getTags({where: newTagParams});

        if(duplicateTags.length > 0) {
            return 409;
        }

        await models.Tag.update(newTagParams, {where: {id: req.params.tagId}});
        return 204;
    });
});

module.exports = {
    getUserBoards: getUserBoards,
    getUserTags: getUserTags,
    putUserTag: putUserTag,
    deleteUserTag: deleteUserTag,
    patchUserTag: patchUserTag
};
