const Song = require("../../models/song");
const song = require("../../models/song");

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
/*
exports.create = async (ctx) => {
  const { title, singer, lyrics } = ctx.request.body;

  const song = new Song({
    title,
    singer,
    lyrics,
  });

  try {
    await song.save();
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = song;
};

exports.delete = async (ctx) => {
  const { id } = ctx.params;

  try {
    await Book.findByIdAndRemove(id).exec();
  } catch (e) {
    if (e.name === "CastError") {
      ctx.status = 400;
      return;
    }
  }

  ctx.status = 204;
};

exports.replace = (ctx) => {
  ctx.body = "replaced";
};

exports.update = async (ctx) => {
  const { id } = ctx.params;

  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }

  let song;

  try {
    song = await Song.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    });
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = song;
};
*/
