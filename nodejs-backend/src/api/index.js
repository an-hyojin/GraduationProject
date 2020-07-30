const Router = require('koa-router');

const api = new Router();

const songs = require('./songs');

api.use('/songs', songs.routes());

api.get('/', (ctx, next)=>{

});

module.exports = api;
