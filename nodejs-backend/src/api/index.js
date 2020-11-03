const Router = require("koa-router");
const request = require("request");
const api = new Router();

const songs = require("./songs");
const users = require("./users");
const quizzes = require("./quizzes");

const fs = require("fs");
const csv = require("csv-parser");
const { mongoose } = require("mongoose");
api.use("/songs", songs.routes());
api.use("/users", users.routes());
api.use("/quizzes", quizzes.routes());

const Song = require("../models/song");
const Word = require("../models/word");
const User = require("../models/user");

var end = new Promise(function (resolve, reject) {
  let results = [];
  fs.createReadStream("../GoodSong.csv")
    .pipe(csv())
    .on("data", async (data) =>
      results.push(data)
     )
    .on("end", async () => {
      resolve(results);
    });
    
});

api.get("/tts", async(ctx, next)=>{
  const api_url ='https://kakaoi-newtone-openapi.kakao.com/v1/synthesize';
  let api_key = 'ea9db858b3e61bb1d6a25eaa17329c34';
  const { morph } = ctx.request.query;
  let body = "<speak><voice name='WOMAN_READ_CALM'>"+morph+"</voice></speak>";
  const result = await request.post({
    uri:api_url,
    body,
    method: 'POST',
    headers: {
      'Authorization': "KakaoAK " + api_key,
      'Content-Type': 'application/xml',
    }
  });
  var writeStream = fs.createWriteStream('./tts1.mp3');
  
  result.pipe(writeStream); // file로 출력
  ctx.body = result;
})

api.get("/temp", async (ctx, next) => {
  let results = await end;
  let body = [];
  ctx.body = "호출";
  for (i = 65; i < 70; i++) {
    console.log(i, results[i].Title)
    body.push(results[i]);
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
        resultArray = b;
        ctx.body = b;
      
        resultArray.forEach((element) => {
          let song = new Song(element);
          song.save();
          console.log(element);
        });
      }
    );
  } catch (error) {
    console.log(error);
    ctx.body = error;
  }
});
module.exports = api;
