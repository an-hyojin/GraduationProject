const Router = require("koa-router");
const request = require("request");

const songs = new Router();

const songsCtrl = require("./songs.controller");

songs.post("/", songsCtrl.post);

songs.get("/", songsCtrl.list);

songs.get("/topten", songsCtrl.topten);

module.exports = songs;
