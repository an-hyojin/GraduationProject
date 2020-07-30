const Song = require('../../models/song');

exports.list = async (ctx) => {
    let songs;
    try {
        songs = await Song.find().exec();
    } catch{
        return ctx.throw(500, e);
    }

    ctx.body = songs; 
}

exports.create = async (ctx) => {
    const {
        title,
        singer,
        lyrics
    } = ctx.request.body;

    const song = new Song({
        title,
        singer,
        lyrics
    });

    try{
        await song.save();
    }catch(e){
        return ctx.throw(500, e);
    }

    ctx.body = song;
}

exports.delete = (ctx) => {
    ctx.body = 'deleted';
}

exports.replace = (ctx) => {
    ctx.body = 'replaced';
}

exports.update = (ctx) => {
    ctx.body = 'updated';
}