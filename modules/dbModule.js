const mongoose = require('mongoose');
const config = require('../config')


const DBModule = (function(){
    return {
        Init: function(){
            (async () => {
                mongoose.connect(config.mongoose.url, { useNewUrlParser: true});
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