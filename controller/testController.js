const express = require("express");
const util = require("util");
const moment = require("moment-timezone");
const _ = require("lodash");
const router = express.Router();

const resultCode = require("../utils/resultCode");
const { respondJson, respondOnError } = require("../utils/respond");
const controllerName = "User";

const data = require("../utils/tempData");

router.use((req, res, next) => {
  console.log(
    util.format(
      "[Logger]::[Controller]::[%sController]::[Access Ip %s]::[Access Time %s]",
      controllerName,
      req.ip,
      moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss")
    )
  );
  next();
});

router.get("/list", async (req, res) => {
  try {
    res.header("Access-Control-Allow-Origin", "*");
    return respondJson(res, resultCode.success, data);
  } catch (e) {
    respondOnError(res, resultCode.error, e.message);
  }
});

router.post("/member/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const member = data.find(member => member.id === id);
    res.header("Access-Control-Allow-Origin", "*");
    return !member
    ? respondOnError(res, resultCode.error, "해당 사번으로 조회되는 임직원이 존재하지 않습니다.")
    : respondJson(res, resultCode.success, member);
  } catch (e) {
    respondOnError(res, resultCode.error, e.message);
  }
});

module.exports = router;
