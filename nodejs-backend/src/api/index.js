const Router = require("koa-router");
const request = require("request");
const api = new Router();

const songs = require("./songs");
const fs = require("fs");
const csv = require("csv-parser");
const { mongoose } = require("mongoose");
api.use("/songs", songs.routes());
const Song = require("../models/song");
const Word = require("../models/word");
var end = new Promise(function (resolve, reject) {
  let results = [];
  fs.createReadStream("../../GoodSong.csv")
    .pipe(csv())
    .on("data", async (data) => await results.push(data))
    .on("end", async () => {
      resolve(results);
    });
});

api.post("/login", async (ctx, next) => {
  ctx.body = "id";
});

api.post("/join", async (ctx, next) => {
  ctx.body = true;
});

api.get("/words", async (ctx, next) => {
  const uri = "http://localhost:8000/nlp/words/";
  try {
    const results = await request.post(
      {
        uri,
        method: "POST",
        json: true,
      },
      async (e, r, b) => {
        console.log(b);

        b.forEach((element) => {
          let word = new Word(element);
          word.save();
        });
        ctx.body = b;
      }
    );
    ctx.body = results.body;
  } catch (error) {
    ctx.body = error;
  }
});

api.get("/quiz/:songId", async (ctx, next) => {
  const { songId } = ctx.params;

  let song;

  try {
    song = await Song.find(
      { _id: songId },
      {
        singer: 1,
        title: 1,
        a_quiz_info: 1,
        b_quiz_info: 1,
        c_quiz_info: 1,
        translation: 1,
        morphs: 1,
        pos_list: 1,
        count_list: 1,
      }
    ).exec();
    quizzes = [];
    song = song[0];
    a_quiz_infos = song.a_quiz_info;
    b_quiz_infos = song.b_quiz_info;
    c_quiz_infos = song.c_quiz_info;
    ctx.body = song;
    while (quizzes.length < 3) {
      if (a_quiz_infos.length > 0 && quizzes.length < 3) {
        let quiz = await makeQuiz(
          a_quiz_infos[Math.floor(Math.random() * a_quiz_infos.length)],
          song
        );
        quiz.level = "A";
        quizzes.push(quiz);
      }

      if (b_quiz_infos.length > 0 && quizzes.length < 3) {
        let quiz = await makeQuiz(
          b_quiz_infos[Math.floor(Math.random() * b_quiz_infos.length)],
          song
        );
        quiz.level = "B";
        quizzes.push(quiz);
      }

      if (c_quiz_infos.length > 0 && quizzes.length < 3) {
        let quiz = await makeQuiz(
          c_quiz_infos[Math.floor(Math.random() * c_quiz_infos.length)],
          song
        );
        quiz.level = "C";
        quizzes.push(quiz);
      }
    }

    ctx.body = quizzes;
  } catch (e) {
    return ctx.throw(500, e);
  }
});
async function makeQuiz(quiz_info, song) {
  let quiz = {};
  let sentence_index = Number.parseInt(quiz_info.sentence_index);
  quiz.title = song.title;
  quiz.singer = song.singer;
  quiz.translation = song.translation[sentence_index];
  quiz.morphs = song.morphs[sentence_index];
  quiz.count_list = song.count_list[sentence_index];
  let morph_index = Number.parseInt(quiz_info.morph_index);
  quiz.morph_index = morph_index;
  quiz.answer = song.pos_list[sentence_index][morph_index];
  let example = await Word.aggregate([
    { $match: { pos: quiz_info.pos } },
    { $project: { word: 1, _id: 0 } },
  ]).sample(4);
  let otherwords = [];
  for (let i = 0; i < example.length; i++) {
    if (example[i].word != quiz.answer) {
      otherwords.push(example[i].word);
    }
  }
  if (otherwords.length > 3) otherwords.shift();
  quiz.example = otherwords;
  return quiz;
}
api.get("/temp", async (ctx, next) => {
  let results = await end;
  let body = [];
  ctx.body = "호출";
  for (i = 10; i < 12; i++) {
    body.push(results[i]);
  }
  console.log(body);
  ctx.body = body;
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
        console.log(b);
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
