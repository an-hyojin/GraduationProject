const Router = require("koa-router");
const request = require("request");

const quizzes = new Router();

const quizCtrl = require("./quizzes.controller");

quizzes.post("/", quizCtrl.quiz_res);

quizzes.get("/:songId", quizCtrl.quiz);
module.exports = quizzes;
