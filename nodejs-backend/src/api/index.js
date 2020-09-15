const Router = require("koa-router");
const request = require("request");
const api = new Router();

const songs = require("./songs");
const users = require("./users");
const fs = require("fs");
const csv = require("csv-parser");
const { mongoose } = require("mongoose");

api.use("/songs", songs.routes());
api.use("./users", users.routes());
const Song = require("../models/song");
const User = require("../models/user");

var end = new Promise(function (resolve, reject) {
  let results = [];
  fs.createReadStream("../../GoodSong.csv")
    .pipe(csv())
    .on("data", async (data) => await results.push(data))
    .on("end", async () => {
      resolve(results);
    });
});

api.get("/temp", async (ctx, next) => {
  let results = await end;
  let body = [];
  for (i = 8; i < 10; i++) {
    body.push(results[i]);

    if (i == 9) break;
  }
  const uri = "http://localhost:8000/nlp/preprocessing/";
  try {
    const results = await request.post(
      {
        uri,
        method: "POST",
        body,
        json: true,
        encoding: null,
      },
      async (e, r, b) => {
        console.log(b);
        resultArray = b;
        resultArray.forEach((element) => {
          let song = new Song(element);
          song.save();
          console.log(element.title);
        });
      }
    );
    ctx.body = results;
  } catch (error) {
    console.log(error);
  }
});

module.exports = api;
