const Router = require('koa-router');
const request = require('request')

const songs = new Router();

const songsCtrl = require('./songs.controller');

songs.post('/', songsCtrl.create);

songs.delete('/', songsCtrl.delete);

songs.put('/', songsCtrl.replace);

songs.patch('/', songsCtrl.update);

songs.get('/', async (ctx, next) => {
    const { s } = ctx.request.query;
   
});

module.exports = songs;