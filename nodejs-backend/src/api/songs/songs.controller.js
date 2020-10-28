const Song = require("../../models/song");

const request = require("request-promise-native");
const { resolve } = require("path");
exports.list = async (ctx) => {
  let songs;
  try {
    songs = await Song.find({}, { singer: 1, title: 1, album:1, _id: 1 }).exec();
  } catch {
    return ctx.throw(500, e);
  }
  ctx.body = songs;
};

exports.post = async (ctx) => {
  console.log(ctx);
  const { songId } = ctx.request.body;

  let song;

  try {
    song = await Song.findById({ _id: songId }).exec();
  } catch (e) {
    return ctx.throw(500, e);
  }
  if (!song) {
    ctx.status = 404;
    ctx.body = { message: "song not found" };
    return;
  }
  ctx.body = song;
};

exports.topten = async (ctx) => {
  let songlist;

  try {
    songlist = await Song.find({}, { singer: 1, title: 1, _id: 1 })
      .sort({ count: -1 })
      .limit(10)
      .exec();
  } catch (e) {
    return ctx.throw(500, e);
  }
  ctx.body = songlist;
};

exports.recommend = async (ctx) => {
  const { userId } = ctx.params;
  const uri = `http://localhost:8000/nlp/recommend/${userId}`;
  let songlist;
  try {
    const recommnedSongIds = await request.post({
      uri,
      method: "POST",
      json: true,
      encoding: null,
    });
    console.log(recommnedSongIds);
    songlist = await Song.find(
      { _id: { $in: recommnedSongIds } },
      { singer: 1, title: 1, _id: 1, album: 1 }
    ).exec();
    ctx.body = songlist;
    console.log(songlist);
  } catch (error) {
    console.log(error);
    ctx.body = error;
  }
};

exports.singer = async(ctx)=>{
  try {
    songs = await Song.find({}, { singer: 1, _id: 1 }).distinct('singer').exec();
    ctx.body = songs;
  } catch {
    return ctx.throw(500, e);
  }
};