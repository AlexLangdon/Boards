"use strict";

const config = require("config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
        config.mysql.database, config.mysql.user, config.mysql.password, 
        {   host: config.mysql.host, port: config.mysql.port, dialect: "mysql", benchmark: true});

const Tag = sequelize.define("tag", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: Sequelize.STRING
});

const User = sequelize.define("user", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    username: Sequelize.STRING
});
User.belongsToMany(Tag, {through: "user_tags", as: "Tags"});
Tag.belongsToMany(User, {through: "user_tags", as: "Users"});

const Board = sequelize.define("board", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: Sequelize.STRING,
    deleted: Sequelize.BOOLEAN
});
User.belongsToMany(Board, { through: "board_owners", as: "Boards"});
Board.belongsToMany(User, { through: "board_owners", as: "Owners"});

// TODO: Note Tags + Note Owner Board
const Note = sequelize.define("note", {
    id: { type: Sequelize.INTEGER, primaryKey: true,  autoIncrement: true },
    boardId: Sequelize.INTEGER,
    title: Sequelize.STRING,
    content: Sequelize.BLOB,
    colour: Sequelize.STRING,
    archived: Sequelize.BOOLEAN,
});

Note.belongsToMany(Tag, {through: "note_tags", as: "Tags"});
Tag.belongsToMany(Note, {through: "note_tags", as: "Notes"})
Note.belongsTo(Board);
Board.hasMany(Note);

module.exports = {
    User: User,
    Tag: Tag,
    Board: Board,
    Note: Note
};
