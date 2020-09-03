const express = require('express');
const http = require('http');
const port = process.env.PORT || 4000;
const serVeStatic = require('serve-static');
const path = require('path');
const CookieParser = require('cookie-parser');
const expressSession = require('express-session');
const expressErrorHandler = require('express-error-handler');

var mongoose = require('mongoose'); // mongoose를 활용

var database;

var userSchema;

var userModel;

function connectDB() {
    var databaseURL = process.env.MONGO_USER_URL; // db경로 (.env에 추가함)
    
    mongoose.Promise = global.Promise; 
    mongoose.connect(databaseURL);

    database.on('open', 
        function () 
        {
            console.log('data base 연결됨 -> ' + databaseURL);

            userSchema = mongoose.Schema({
                _id : String,
                password : String,
                email : String
            }); // user에 대한 스키마정의 -> id, password, email
            console.log('userSchema 정의');

            userModel = mongoose.model('users', userSchema); // 스키마를 모델로 변환
            console.log('userModel 정의');
        }
    );

    database.on('disconnected',  // db 연결 끊길 때
        function () {
            console.log('data base 연결 끊어짐');
        }
    );

    database.on('error',        // 에러 발생 시
        console.error.bind(console, 'mongoose 연결 에러')
    );
}

var app = express(); // express 객체

app.set('port', port); // 체크

var bodyParserPost = require('body-parser');

app.use(bodyParserPost.urlencoded({ extended : false })); // post방식일 때
app.use(bodyParserPost.json()); // json 방식일 때


//app.use('/public', static(path.join(__diranme, 'public')));  -> public이란 폴더를 static으로 오픈하고 싶을 때 사용


app.use(CookieParser()); // 쿠키와 세션을 미들웨어로 등록


// 세션 설정
app.use(expressSession({
    secret : 'my key',
    resave : true,
    saveUninitialized : true
}));

// 라우터 객체
var router = express.Router();

// 로그인 라우터
router.route('/login').post( 
    function(req, res) {
        console.log('/login 라우터 호출됨');
        var paramID = req.body.id || req.query.id;
        var paramPW = req.body.password || req.query.password;
        console.log('ID : ' + paramID + ', PW : ' + paramPW);

        if(database){
            authUser(database, paramID, paramPW,
                function(err, docs){
                    if(database){
                        if(err){
                            console.log('Error!');
                            alert('에러 발생');
                            res.end();
                            return;
                        }

                        if(docs){
                            console.dir(docs);
                            alert('로그인에 성공했습니다!');
                            res.redirect() // 로그인 페이지 이후 경로 넣거나 그냥 없애도 되는지 체크
                        } else {
                            console.log('empty error!');
                            alert('존재하지 않는 아이디입니다.');
                            res.redirect('/login') // 로그인 페이지
                        }
                    } else {
                        console.log('DB 연결이 되지 않음');
                        res.writeHead(200, {"Content-Type" : 'text/html;charset=utf8'});
                        res.write('<h1>database 연결 안됨</h1>');
                        res.end();
                    }
                }
            );
        }
    }
)


// 회원가입 라우터
router.route('/join').post(
    function(req, res) {
        console.log('/join 라우터 호출됨');
        var paramID = req.body.id || req.query.id;
        var paramPW = req.body.password || req.query.password;
        var paramEmail = req.body.email || req.query.email;
        console.log('paramID : ' + paramID + ', paramPW : ' + paramPW + ', paramEmail : ' + paramEmail);

        if(database){
            addUser(database, paramID, paramPW, paramEmail,
                function(err, result) {
                    if(err){
                        console.log('Error!');
                        res.writeHead(200, {"Content-Type" : 'text/html;charset=utf8'});
                        res.write('<h1>에러 발생</h1>'); // alert('에러 발생');
                        res.end();
                        return;
                    }

                    if(result){
                        console.dir(result);
                        alert('회원가입에 성공했습니다!');
                    } else {
                        console.log('추가 되지 않음!');
                        alert('회원가입에 실패했습니다!');
                        res.end();
                    }
                });
        } else {
            console.log('DB 연결이 되지 않음');
            res.writeHead(200, {"Content-Type" : 'text/html;charset=utf8'});
            res.write('<h1>database 연결 안됨</h1>');
            res.end();
        }
    }
);

app.use('/', router);

// 로그인 시 유저가 디비 안에 있나 검사 (Authorization user)
var authUser = function(db, _id, password, callback) {
    console.log('input id : ' + _id.toString() + '  : pw : ' + password);
    // 내장함수 find 사용
    userModel.find({ "id" : _id, "password" : password }, 
        function(err, docs)
        {
            if(err){
                callback(err, null);
                return;
            }

            if(docs.length > 0){
                console.log('find user [ ' + docs + ' ]');
                callback(null, docs);
            } else {
                console.log('cannot find user [ ' + docs + ' ]');
                callback(null, null);
            }
        }
    );
}

var addUser = function(db, _id, password, email, callback) {
    console.log('add User 호출됨 ' + _id + ', ' + password +', ' + email);

    // 추가하려는 유저에 대한 객체
    var user = new userModel({ "id" : _id, "password" : password, "email" : email });
    // 내장함수 save 사용
    user.save
    (
        function(err)
        {
            if(err){
                callback(err, null);
                return;
            }          
            console.log('사용자 추가 됨');
            callback(null, user);    
        }
    )
}


// 혹시 모를 로그아웃
// var logOut = function(req, res) {
//     req.session.destroy();
//     res.clearCookie('my key');
//     alert('로그아웃 되었습니다!');
//     res.redirect('/login');
// }

// 예외처리 부분

// var errorHandler = expressErrorHandler(
//     { static : { '404' : './public/404.html'} }
// );

// app.use(expressErrorHandler.httpError(404));
// app.use(expressErrorHandler);

// 예외처리
app.all('*', function(req, res) {
    res.status(404).send('<h1>요청하신 페이지는 없습니다.</h1>'); 
}); 

// 서버 실행 및 db연결
var appServer = http.createServer(app);
appServer.listen(app.get('port'), 
    function () {
        console.log('express로 웹 서버 실행 : ' + app.get('port'));
        connectDB();
    }
);