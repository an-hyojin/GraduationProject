const mongoose = require("mongoose");
const crypto = require("crypto");

const learnSchema = new mongoose.Schema({
  learning: String,
});

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  email: String,
  learning: [learnSchema],
  a: { type: Number, default: 0 },
  b: { type: Number, default: 0 },
  c: { type: Number, default: 0 },
  // favorite : [String]
});

function hash(password) {
  return crypto
    .createHmac("sha256", process.env.SECRET_KEY)
    .update(password)
    .digest("hex");
}

userSchema.statics.join = function ({ id, password, email }) {
  const user = new this({
    id,
    password: hash(password),
    email,
  });
  return user.save();
}; // 회원가입

userSchema.statics.findByUser = function (id) {
  return this.findOne({ id }).exec();
};

userSchema.methods.validatePassword = function (password) {
  const hashed = hash(password);
  return this.password === hashed;
};

module.exports = mongoose.model("User", userSchema);
