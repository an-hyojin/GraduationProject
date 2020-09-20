const mongoose = require("mongoose");

// User 스키마 정의

const userSchema = new mongoose.Schema({
  id: String,
  email: String,
  password: String,
  learning: [String],
});

// 첫 번째 param -> 스키마 이름, 두 번째 param -> 스키마 객체
module.exports = mongoose.model("User", userSchema);
