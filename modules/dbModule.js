const mongoose = require('mongoose');
const config = require('../config');


const option = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000,
    useNewUrlParser: true
};

const DBModule = (function(){
    return {
        Init: function(){
            (async () => {
                mongoose.connect(config.mongoose.url, option);
            })().then(_ => {
                const db = mongoose.connection;
                db.on('error', console.error);

                db.once('open', () => {
                    console.log('Connect to mongod server');
                });

                mongoose.Promise = global.Promise;
            })
        }
    };
})();

module.exports = DBModule;