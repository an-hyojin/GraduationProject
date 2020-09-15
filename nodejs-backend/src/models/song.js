const mongoose = require("mongoose");

// Song 스키마 정의

const quizSchema = new mongoose.Schema({
  sentence_index: Number,
  morph_index: Number,
  pos: String,
});

const songSchema = new mongoose.Schema({
  singer: String,
  title: String,
  album: String,
  sentences: [String],
  morphs: [[String]],
  pos_list:[[String]],
  count_list: [[Number]],
  a_count: Number,
  b_count: Number,
  c_count: Number,
  a_list: [[Number]],
  b_list: [[Number]],
  c_list: [[Number]],
  translation: [String],
  morphs_trans: [[String]],
  a_quiz_info: [quizSchema],
  b_quiz_info: [quizSchema],
  c_quiz_info: [quizSchema],
});
// 스키마 -> 모델 변환
// 첫 번째 param -> 스키마 이름, 두 번째 param -> 스키마 객체
module.exports = mongoose.model("Song", songSchema);
