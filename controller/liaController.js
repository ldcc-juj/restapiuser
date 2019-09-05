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

router.post('/order/list', async (req, res) => {
    try {
        const responseResult = {
            "contentType": [
                "textRandom",
                "button"
            ],
            "inputType": "text",
            "responseText": [
                "현재 오픈 시간이 아닙니다.\n\n롯데리아 구로점은 10:30에서 22:30까지 운영됩니다."
            ],
            "imagePath": null,
            "imageUrl": null,
            "responseButtons": [{
                "type": "webLinkUrl",
                "name": "24시 매장 검색",
                "nextBlock": null,
                "webLinkUrl": "http://www.lotteria.com/Shop/Shop_List.asp",
                "appLinkUrl": ""
            }],
            "responseTitle": ""
        }
        const openTime = moment('10:30', 'HH:mm');
        const closeTime = moment('22:30', 'HH:mm');

        const isBetweenTime = moment().tz('Asia/Seoul').isBetween(openTime, closeTime);

        if (isBetweenTime) {
            const burgerList = await go(
                config.burgers,
                map(burger => (`${burger.name} | 단품 ${burger.price}원 | 세트 ${burger.setPrice}원`)),
                list => list.join("\n")
            )

            responseResult.responseText = [`현재 주문가능한 메뉴입니다.\n\n${burgerList}\n주문하실 메뉴와 수량을 입력하세요~`];
            responseResult.responseButtons = [{
                "name": "주문 취소",
                "type": "blockLink",
                "nextBlock": {
                    "id": "5d70a14197a0671e5c629530",
                    "name": "주문취소",
                    "blockIndex": "scenario_5d4a8be702ab5d0029b5e282_5d70a14197a0671e5c629530"
                },
                "webLinkUrl": "",
                "appLinkUrl": ""
            }];
        }

        return respondJson(res, resultCode.success, responseResult);
    }
    catch (e) {
        respondOnError(res, resultCode.error, e.message);
    } 
});

router.post('/order/burger', async (req, res) => {
    try {
        const { burger, isSet, number } = req.body;
        const responseResult = {
            "contentType": [
                "textRandom",
                "button"
            ],
            "inputType": "text",
            "responseText": ["주문을 접수하지 못했습니다. 상담원을 연결하시겠어요?"],
            "imagePath": null,
            "imageUrl": null,
            "responseButtons": [],
            "responseTitle": ""
        }

        const burgerList = config.burgers.map(burger => burger.name);

        if (!burgerList.includes(burger)) {
            responseResult.responseText = [`해당 버거 ${burger}는 저희 매장에서 현재 주문가능하지 않습니다. ㅠ_ㅠ\n주문 접수를 하지 못했어요..`]
        } else {
            const matchedBurger = config.burgers.find(burg => burg.name === burger);
            const burgerPrice = isSet === "세트" ? matchedBurger.setPrice : matchedBurger.price;

            const totalPrice = burgerPrice * Number(number);
            responseResult.responseText = [
            `요청 상세: ${burger} ${isSet} ${number}개
으로 주문을 요청하시겠어요?

주문 금액은 ${totalPrice}원입니다.`];
            responseResult.responseButtons = [{
                "name": "주문 접수하기",
                "type": "blockLink",
                "nextBlock": {
                    "id": "5d4a8d0b02ab5d0029b5e28c",
                    "name": "주문 확인",
                    "blockIndex": "scenario_5d4a8ca902ab5d0029b5e28b_5d4a8d0b02ab5d0029b5e28c"
                },
                "webLinkUrl": "",
                "appLinkUrl": ""
            }];
        }

        return respondJson(res, resultCode.success, responseResult);
    }
    catch (e) {
        respondOnError(res, resultCode.error, e.message);
    } 
});

router.post('/order/dessert', async (req, res) => {
    try {
        const { dessert } = req.body;
        const responseResult = {
            "contentType": [
                "textRandom",
                "button"
            ],
            "inputType": "text",
            "responseText": ["주문을 접수하지 못했습니다. 상담원을 연결하시겠어요?"],
            "imagePath": null,
            "imageUrl": null,
            "responseButtons": [],
            "responseTitle": ""
        }

        const dessertList = config.desserts.map(dess => dess.name);

        if (dessert !== "없음" && !dessertList.includes(dessert)) { 
            responseResult.responseText = [`해당 사이드메뉴 ${dessert}는 저희 매장에서 주문가능하지 않습니다. ㅠ_ㅠ\n주문 접수를 하지 못했어요..`]
        } else {
            const matchedDessert = config.desserts.find(dess => dess.name === dessert);
            let dessertPrice = 0;
            if (!!matchedDessert) {
                dessertPrice = matchedDessert.price;
            }

            responseResult.responseText = [`네! ${dessert} 추가하겠습니다!\n추가로 ${dessertPrice}원이 지불됩니다.`]
            responseResult.responseButtons = [{
                "name": "주문 접수하기",
                "type": "blockLink",
                "nextBlock": {
                    "id": "5d4a8d0b02ab5d0029b5e28c",
                    "name": "주문 확인",
                    "blockIndex": "scenario_5d4a8ca902ab5d0029b5e28b_5d4a8d0b02ab5d0029b5e28c"
                },
                "webLinkUrl": "",
                "appLinkUrl": ""
            }];
        }

        return respondJson(res, resultCode.success, responseResult);
    }
    catch (e) {
        respondOnError(res, resultCode.error, e.message);
    } 
});

router.post('/order/check', async (req, res) => {
    try {
        const { address, burger, isSet, number, dessert = "없음" } = req.body;
        const responseResult = {
            "contentType": [
                "textRandom",
                "button"
            ],
            "inputType": "text",
            "responseText": ["주문을 접수하지 못했습니다. 상담원을 연결하시겠어요?"],
            "imagePath": null,
            "imageUrl": null,
            "responseButtons": [],
            "responseTitle": ""
        }

        const burgerList = config.burgers.map(burger => burger.name);
        const dessertList = config.desserts.map(dess => dess.name);

        if (!burgerList.includes(burger)) {
            responseResult.responseText = [`해당 버거 ${burger}는 저희 매장에서 주문가능하지 않습니다. ㅠ_ㅠ\n주문 접수를 하지 못했어요..`]
        } else if (dessert !== "없음" && !dessertList.includes(dessert)) { 
            responseResult.responseText = [`해당 사이드메뉴 ${dessert}는 저희 매장에서 주문가능하지 않습니다. ㅠ_ㅠ\n주문 접수를 하지 못했어요..`]
        } else {
            const matchedBurger = config.burgers.find(burg => burg.name === burger);
            const burgerPrice = isSet === "세트" ? matchedBurger.setPrice : matchedBurger.price;

            const matchedDessert = config.desserts.find(dess => dess.name === dessert);
            let dessertPrice = 0;
            if (!!matchedDessert) {
                dessertPrice = matchedDessert.price;
            }
            const totalPrice = burgerPrice * Number(number) + dessertPrice;
            responseResult.responseText = [
            `주문이 접수되었습니다.
[주문 내역]
배달 희망 주소: ${address}

요청 상세: ${burger} ${isSet} ${number}개

추가 주문: ${dessert}

주문 금액: ${totalPrice}원`]
        }

        return respondJson(res, resultCode.success, responseResult);
    }
    catch (e) {
        respondOnError(res, resultCode.error, e.message);
    } 
});

module.exports = router;