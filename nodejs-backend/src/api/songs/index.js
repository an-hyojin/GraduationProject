const Router = require("koa-router");
const request = require("request");

const songs = new Router();

const songsCtrl = require("./songs.controller");

songs.post("/", songsCtrl.post);

songs.get("/", songsCtrl.list);

songs.get("/topten", songsCtrl.topten);

songs.get("/recommend/:userId", songsCtrl.recommend);

songs.get("/singer", songsCtrl.singer);

module.exports = songs;
