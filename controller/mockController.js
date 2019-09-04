const express = require('express');
const util = require('util');
const moment = require('moment-timezone');
const _ = require('lodash');
const router = express.Router();

const resultCode = require('../utils/resultCode');
const { respondJson, respondOnError } = require('../utils/respond');
const config = require('../config');
const controllerName = 'User';

router.use((req, res, next) => {
    console.log(util.format('[Logger]::[Controller]::[%sController]::[Access Ip %s]::[Access Time %s]',
                              controllerName,
                              req.ip,
                              moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')
                          ));
    next();
});

router.post('/user/check', async (req, res) => {
    try {
        const { user, phone, utterance = "" } = req.body;

        const responseResult = {
            "contentType": [
                "textRandom",
                "button"
            ],
            "inputType": "text",
            "responseText": [
                "이런! 저희 롭스에 가입되어 있는 고객님이 아닌거 같아요ㅠㅠ\n가입을 도와드릴까요?"
            ],
            "imagePath": null,
            "imageUrl": null,
            "responseButtons": [{
                "type": "webLinkUrl",
                "name": "웹링크",
                "nextBlock": null,
                "webLinkUrl": "www.lohbs.com",
                "appLinkUrl": ""
            }],
            "responseTitle": ""
        }

        if (!user || !phone) { return respondJson(res, resultCode.success, responseResult); }
        const findUser = await config.users.find(us => us.name === user && (us.hp === phone || us.hp === utterance));
        if (!!findUser) {
            responseResult.responseText = [
                `띵동!
                ${user}님의 입력하신 휴대폰 번호 ${phone}으로 인증번호를 전송하였습니다!
                입력해주세요~`
            ]
            responseResult.responseButtons = [];
        } else {
            return respondJson(res, resultCode.success, responseResult);
        }
        
        // go(data,
        //    v => userModel.create(v).catch(e => {throw e}),
        //    insertToRedis => setValue(insertToRedis.token, insertToRedis._id),
        //    insertKey => getValue(insertKey),
        //    //insertResult => res.json(insertResult)
        //    insertResult => respondJson(res, resultCode.success, { data : insertResult })
        // );

        return respondJson(res, resultCode.success, responseResult);
    }
    catch (e) {
        respondOnError(res, resultCode.error, e.message);
    } 
});

router.post('/user/get', async (req, res) => {
    try {
        const { user, phone, utterance = "" } = req.body;

        const responseResult = {
            "contentType": [
                "textRandom",
                "button"
            ],
            "inputType": "text",
            "responseText": [
                "인증에 실패하였습니다. 다시 입력해주세요.",
            ],
            "imagePath": null,
            "imageUrl": null,
            "responseButtons": [],
            "responseTitle": ""
        }

        if (utterance === '123456') {
            const findUser = await first(config.users.filter(us => us.name === user && us.hp === phone));
            const orderList = findUser.orderList.join('\n');
            responseResult.responseText = [
                `${user}고객님, 인증해주셔서 감사합니다:)
                고객님의 최근 3개월 주문 내역은 다음과 같습니다.

                ${orderList}
                `
            ]
        }

        return respondJson(res, resultCode.success, responseResult);
    } catch (e) {
        respondOnError(res, resultCode.error, e.message);
    } 
});

module.exports = router;