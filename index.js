'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');

const config = { 
    channelAccessToken: 'YJEqpRUwwI3hqPV9Zrj9rycWQAsM8hopxLPRPXqv/peKoSGdYt5llaVHPnm9t8bSCXy63bOn0o+4SEuv0NrlHstDYDgdlLXJbgzkX8t1/HT4FeTLZR3ZPbtoatyYCLgprV9EuUpH7w8+/zvpM8iqKAdB04t89/1O/w1cDnyilFU=',
    channelSecret: '5c44f24bc49020a05318129eb7405839',
};

const client = new line.Client(config);
const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  let mes = ''
  if(event.message.text === '天気教えて！'){
    mes = 'ちょっとまってね'; //待ってねってメッセージだけ先に処理
    getNodeVer(event.source.userId); //スクレイピング処理が終わったらプッシュメッセージ
  }else{
    mes = event.message.text;
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: mes
  });
}

const getNodeVer = async (userId) => {
    const res = await axios.get('http://weather.livedoor.com/forecast/webservice/json/v1?city=400040');
    const item = res.data;

    await client.pushMessage(userId, {
        type: 'text',
        text: item.description.text,
    });
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);