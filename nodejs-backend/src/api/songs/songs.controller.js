const Song = require("../../models/song");

exports.list = async (ctx) => {
  let songs;
  try {
    songs = await Song.find({}, { singer: 1, title: 1, _id: 1 }).exec();
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
  
  try{
    songlist = await Song.find({}, { singer : 1, title : 1, _id : 1}).sort({count : -1}).limit(10).exec();
  } catch (e) {
    return ctx.throw(500, e);
  }
  ctx.body = songlist;
};
