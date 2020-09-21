const mongoose = require("mongoose");

// Quiz 스키마 정의

const wordSchema = new mongoose.Schema({
    word:String,
    pos: String,
});

// 첫 번째 param -> 스키마 이름, 두 번째 param -> 스키마 객체
module.exports = mongoose.model("Word", wordSchema);
