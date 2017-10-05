"use strict";

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userEp = require("./endpoints/user");
const boardEp = require("./endpoints/board");
const noteEp = require("./endpoints/note");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Boards
app.post("/board/:username", boardEp.postBoard);
app.get("/board/:boardId", boardEp.getBoard);
app.delete("/board/:boardId", boardEp.deleteBoard);
app.patch("/board/:boardId", boardEp.patchBoard);

// Notes
app.get("/board/:boardId/notes", noteEp.getNotes);
app.post("/board/:boardId/notes", noteEp.postNote);
app.delete("/board/:boardId/notes/:noteId", noteEp.deleteNote);
app.patch("/board/:boardId/notes/:noteId", noteEp.patchNote);

// User
app.get("/user/:username/boards", userEp.getUserBoards);
app.get("/user/:username/tags", userEp.getUserTags);
app.put("/user/:username/tags/:tagName", userEp.putUserTag);
app.delete("/user/:username/tags/:tagId", userEp.deleteUserTag);
app.patch("/user/:username/tags/:tagId", userEp.patchUserTag)

app.listen(3000);

module.exports = {
    app: app
};
