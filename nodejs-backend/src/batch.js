const schedule = require('node-schedule');
const request = require('request')

// 배치
const scheduler = schedule.scheduleJob('* * * * *', async () => {
      console.log('running a task every minute');
      const uri = 'http://localhost:8000/nlp/list/';
      try {
        const result = await request.post({
            uri,
            method:'POST',
            body:{
                "lyrics": "눈부신 하늘에 시선을 가린 채 네 품 안에 안기네 흐르는 음악에 정신을 뺏긴 채 그대로 빨려 드네 Help me help me 숨이 멎을 것 같이 I feel Set me free set me free 녹아 버릴 것 같이 So sick 쉴 틈 없이 빠져들고 이리저리 갖고 놀고 이성을 깨부수고 제멋대로 들어오지 위험하니 갖고 싶고 아픔까지 안고 싶고 결국 너를 품으니 난 Oh my god She took me to the sky Oh my god She showed me all the stars Babe babe 달려들 것만 같이 Come in Make me make me 정신 나갈 것 같이 Like it Oh god 어찌 저에게"
            },
            json:true
        })
        console.log(result)
      } catch(error){
        console.log(error)
      }
     
});
