const schedule = require("node-schedule");
const request = require("request");

// 배치
const scheduler = schedule.scheduleJob("? ? 1 * *", async () => {
  // 한달마다 실행 -> 배치로 테스트 하기 어려우니 api 하나 더 만들어서 테스트 해보고 하단에 코드 작성 바람!

  console.log("running a task every minute");
  const uri = "http://localhost:8000/nlp/crawling/";
  try {
    const result = await request.post(
      {
        uri,
        method: "POST",
        json: true,
      },
      async (e, r, b) => {
        console.log(b);
        resultArray = b;
        resultArray.forEach((element) => {
          let song = new Song(element);
          song.save();
          console.log(element.title);
        });
      }
    );
    console.log(result);
    //result db에 저장해야할 부분
  } catch (error) {
    console.log(error);
  }

  ctx.body = results;
});
