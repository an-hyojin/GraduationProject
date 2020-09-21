const Joi = require('joi');
const User = require('../../models/user');

// 로그인
exports.login = async(ctx) => {
    const schema = Joi.object({
        id : Joi.string().required(),
        password : Joi.string().required()
    }); // 데이터 검증

    const result = schema.validate(ctx.request.body);

    if(result.error) {
        ctx.status = 400;
        return;
    }

    const { id, password } = ctx.request.body;

    let user;

    try {
        // 체크
        user = await User.findByUser(id);
    } catch(e) {
        ctx.throw(500, e);
    }

    if(!user) { // if(!user || user.validatePassword(password))
        ctx.status = 403;
        ctx.body = { message : "user not found" };
        return;
    } // db에 없거나 비밀번호 틀리면 X
    ctx.body = user;
};

// 회원가입
exports.join = async (ctx) => {
    const schema = Joi.object({
        id : Joi.string().required(),
        password : Joi.string().required(),
        email : Joi.string().required().email()
    }); // 데이터 검증
    
    const validation = schema.validate(ctx.request.body);

    if(validation.error) {
        ctx.status = 400;
        return;
    }

    let duplicate = null;

    try {
        // 체크
        duplicate = await User.findOne(ctx.request.body);
    } catch(e) {
        ctx.throw(500, e);
    }

    if(duplicate) {
        ctx.status = 409;
        ctx.body = '아이디가 중복되었습니다'; // 지워도 상관없을 듯
        return;
    } // id값 중복 검사

    let account;
    try {
        account = await User.join(ctx.request.body);
    } catch(e) {
        ctx.throw(500, e);
    } // 계정 추가

    ctx.body = true; // 회원가입 성공 시 true 넘겨주기
};
