
const mongoose = require('mongoose');

// Song 스키마 정의

const songSchema = new mongoose.Schema({
    singer: String,
    title: String,
    album: String,
    sentences: [String],
    morphs: [[String]],
    count_list: [[Number]],
    a_list:[[Number]],
    b_list:[[Number]],
    c_list:[[Number]],
    translation:[String]
    

});

// 스키마 -> 모델 변환
// 첫 번째 param -> 스키마 이름, 두 번째 param -> 스키마 객체
module.exports = mongoose.model('Song', songSchema);
