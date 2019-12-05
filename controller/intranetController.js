const express = require('express');
const util = require('util');
const moment = require('moment-timezone');
const _ = require('lodash');
const router = express.Router();

const resultCode = require('../utils/resultCode');
const { respondJson, respondOnError } = require('../utils/respond');
const config = require('../config');
const controllerName = 'Intranet';

router.use((req, res, next) => {
    console.log(util.format('[Logger]::[Controller]::[%sController]::[Access Ip %s]::[Access Time %s]',
                              controllerName,
                              req.ip,
                              moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')
                          ));
    next();
});

router.post('/echo', async (req, res) => {
    try {
        const { body } = req.body;

        return respondJson(res, resultCode.success, body);
    }
    catch (e) {
        respondOnError(res, resultCode.error, e.message);
    }
});

router.post('/askAgain', async (req,res) => {
    try {
        const responseResult = {
            "contentType": [
                "textRandom",
            ],
            "inputType": "text",
            "responseText": [
                "되묻기 전용 스킬입니다 :)~~",
                "되물어보는 스킬",
                "어떤 걸 되물을 것인가~~"
            ],
            "imagePath": null,
            "imageUrl": null,
            "responseButtons": [{
                "type": "webLink",
                "name": "전자결재 바로가기",
                "nextBlock": null,
                "webLinkUrl": "https://intranet.lotte.net/Default.aspx",
                "appLinkUrl": ""
            }],
            "responseTitle": ""
        }

        return respondJson(res, resultCode.success, responseResult);
    } catch (e) {
        respondOnError(res, resultCode.error, e.message);
    }
});

router.post('/register', async (req, res) => {
    try {
        const { team, name, departDate, arriveDate } = req.body;

        if (isEmpty(team) || isEmpty(name) || isEmpty(departDate) || isEmpty(arriveDate)) {
            const fallbackResult = {
                "contentType": [
                    "textRandom",
                ],
                "inputType": "text",
                "responseText": [
                    "필수값들이 모두 입력이 안되었네용 ㅠ_ㅠ"
                ],
                "imagePath": null,
                "imageUrl": null,
                "responseButtons": [],
                "responseTitle": ""
            }
            return respondJson(res, resultCode.success, fallbackResult);
        }

        const responseResult = {
            "contentType": [
                "textRandom",
                "button"
            ],
            "inputType": "text",
            "responseText": [
                `${team}소속 ${name}님의 ${departDate} ~  ${arriveDate} 출장 신청이 완료되었습니다\n전자결재를 통하여 소속된 팀의 팀장에게 자동으로 상신됩니다.\n결재 여부는 인트라넷에서 확인하실 수 있습니다.`
            ],
            "imagePath": null,
            "imageUrl": null,
            "responseButtons": [{
                "type": "webLink",
                "name": "전자결재 바로가기",
                "nextBlock": null,
                "webLinkUrl": "https://intranet.lotte.net/Default.aspx",
                "appLinkUrl": ""
            }],
            "responseTitle": ""
        }

        return respondJson(res, resultCode.success, responseResult);
    }
    catch (e) {
        respondOnError(res, resultCode.error, e.message);
    }
});

module.exports = router;