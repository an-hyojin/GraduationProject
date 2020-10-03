const Song = require("../../models/song");
const User = require("../../models/user");
const Word = require("../../models/word");

exports.quiz = async (ctx, next) => {
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
    if (a_quiz_infos.length > 0) {
      let quiz = await makeQuiz(
        a_quiz_infos[Math.floor(Math.random() * a_quiz_infos.length)],
        song
      );
      quiz.level = "A";
      quizzes.push(quiz);
    }

    if (b_quiz_infos.length > 0) {
      let quiz = await makeQuiz(
        b_quiz_infos[Math.floor(Math.random() * b_quiz_infos.length)],
        song
      );
      quiz.level = "B";
      quizzes.push(quiz);
    }

    if (c_quiz_infos.length > 0) {
      let quiz = await makeQuiz(
        c_quiz_infos[Math.floor(Math.random() * c_quiz_infos.length)],
        song
      );
      quiz.level = "C";
      quizzes.push(quiz);
    }

    ctx.body = quizzes;
  } catch (e) {
    return ctx.throw(500, e);
  }
};

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

exports.quiz_res = async (ctx, next) => {
  console.log(ctx.request.body);
  ctx.body = ctx.request.body;
  const { songId, userId, a, b, c } = ctx.request.body;
  await Song.findOneAndUpdate({ _id: songId }, { $inc: { count: 1 } });
  // ctx.body = song;

  await User.findOneAndUpdate(
    { _id: userId },
    {
      $inc: { a: a, b: b, c: c },
      $push: { learning: { learning: songId } },
    },
    { setDefaultsOnInsert: true }
  );
};