const userController = require('../controller/userController');
const mockController = require('../controller/mockController');
const liaController = require('../controller/liaController');
const IntranetController = require('../controller/intranetController');

module.exports = {
    userCtrl: userController,
    mockCtrl: mockController,
    liaCtrl: liaController,
    IntranetCtrl: IntranetController
};