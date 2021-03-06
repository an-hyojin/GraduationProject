const Joi = require("joi");
const User = require("../../models/user");
const Song = require("../../models/song");
// 로그인
exports.login = async (ctx) => {
 
  const schema = Joi.object({
    id: Joi.string().required(),
    password: Joi.string().required(),
  }); // 데이터 검증

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    return;
  }

  const { id, password } = ctx.request.body;
  
  let user;

  try {
    // 체크
    user = await User.findByUser(id);
  } catch (e) {
    ctx.throw(500, e);
  }

  if (!user || !user.validatePassword(password)) {
    ctx.status = 403;
    return;
  } // db에 없거나 비밀번호 틀리면 X
  ctx.body ={id:user.id, auth:user._id};
};

// 회원가입
exports.join = async (ctx) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().required().email(),
    favorite : Joi.required()
  }); // 데이터 검증
  const validation = schema.validate(ctx.request.body);
  console.log(validation);
  if (validation.error) {
    ctx.status = 400;
    return;
  }

  let duplicate = null;

  try {
    // 체크
    duplicate = await User.findByUser(ctx.request.body.id);
  } catch (e) {
    ctx.throw(500, e);
  }

  if (duplicate) {
    ctx.status = 409;
    ctx.body = "아이디가 중복되었습니다"; // 지워도 상관없을 듯
    return;
  } // id값 중복 검사
  ctx.request.body.learning = [];
  
  let account;
  try {
    account = await User.join(ctx.request.body);
  } catch (e) {
    ctx.throw(500, e);
  } // 계정 추가

  ctx.body = true; // 회원가입 성공 시 true 넘겨주기
};

exports.info = async (ctx, next) => {
  const { id } = ctx.request.body;

  let user = await User.findById({ _id: id }, { password: 0 }).exec();
 
  let learn = [];
  if (!!user.learning && user.learning.length > 0) {
    let learnSongs = user.learning.map((v) => v.learning);
    let res = await Song.find({}, { singer: 1, title: 1 })
      .where("_id")
      .in(learnSongs)
      .exec();

    res.forEach((v) => {
      learn.push(JSON.stringify(v));
    });
  }
  let res = {};
  res._id = user._id;
  res.id = user.id;
  res.email = user.email;
  res.learning = learn;
  ctx.body = res;
};
