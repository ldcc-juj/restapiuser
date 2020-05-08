const userController = require('../controller/userController');
const mockController = require('../controller/mockController');
const liaController = require('../controller/liaController');
const IntranetController = require('../controller/intranetController');
const testController = require("../controller/testController");

module.exports = {
    userCtrl: userController,
    mockCtrl: mockController,
    liaCtrl: liaController,
    IntranetCtrl: IntranetController,
    testCtrl: testController
};