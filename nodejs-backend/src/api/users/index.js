const Router = require('koa-router');
const users = new Router();
const usersCtrl = require('./users.controller');

users.post('/login', usersCtrl.login);
users.post('/join', usersCtrl.join);

module.exports = users;
