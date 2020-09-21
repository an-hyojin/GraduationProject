const Router = require("koa-router");
const users = new Router();
const usersCtrl = require("./users.controller");
const koaBody = require("koa-body");

users.post("/login", koaBody({ multipart: true }), usersCtrl.login);

users.post("/join", koaBody({ multipart: true }), usersCtrl.join);

users.post("/info", usersCtrl.info);

module.exports = users;
