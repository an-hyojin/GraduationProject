
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Song 스키마 정의

const Singer = new Schema({
    name: String,
    id: Number
});

const Song = new Schema({
    title: String,
    singer: Singer, 
    lyrics: String
});

// 스키마 -> 모델 변환
// 첫 번째 param -> 스키마 이름, 두 번째 param -> 스키마 객체
module.exports = mongoose.model('Song', Song);
