require('dotenv').config(); // .env 파일에서 환경변수 불러오기
const cors = require('@koa/cors'); // cors policy 해결 위함

const Koa = require('koa'); // koa 서버
const Router = require('koa-router'); // api router 설정

const app = new Koa(); 
const router = new Router();

const api = require('./api'); // api폴더 내에서 정의한 api router 사용

const mongoose = require('mongoose'); // mongo database 사용 위함
const bodyParser = require('koa-bodyparser');

const corsOptions = {
    origin: 'http://localhost:4200', // 허락하고자 하는 요청 주소
    credentials: true, // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
};

app.use(cors(corsOptions)); // config 추가

mongoose.Promise = global.Promise; // Node 의 네이티브 Promise 사용
// mongodb 연결
mongoose.connect(process.env.MONGO_URI, {
    usemongoClient:true
}).then(
    (response) => {
        console.log('연결');
        console.log('Successfully connected to mongodb');
    }
).catch(e => {
    console.error(e);
});


const port = process.env.PORT || 4000; // PORT 값이 설정되어있지 않다면 4000 을 사용합니다.

app.use(bodyParser());

router.use('/api', api.routes());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
    console.log('heurm server is listening to port ' + port);
});
const scheduler = require('./batch') // 스케쥴러 설정