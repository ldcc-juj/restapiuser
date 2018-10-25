require('./utils/functional');

const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment-timezone');
const util = require('util');

const config = require('./config');
const dbModule = require('./modules/dbModule');
const routeModule = require('./modules/routeModules');

global.app = new express();

function processRun() {
    (async () => {
        app.set('port', process.env.PORT || config.server.port);
        app.use(bodyParser.json({limit: '15mb'}));
        app.use(bodyParser.urlencoded({ extended: true, limit: '15mb' }));

        dbModule.Init();
        routeModule.Init();
    })().then(_ => {
        http.createServer(app).listen(app.get('port'), () => {
            console.log(util.format('[Logger]::[Process On]::[Pid:%d]::[Server Running At %d]::[%s]::[Started]',
                                process.pid,
                                config.server.port,
                                moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')));
        });
    });
};

processRun();