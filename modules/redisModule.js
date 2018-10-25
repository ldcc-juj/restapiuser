const ioRedis = require('ioredis');
const util = require('util');
const moment = require('moment-timezone');

const config = require('../config');

const RedisModule = (function(){
    const redis = new ioRedis({
        port: config.redis.redisPort,
        host: config.redis.redisHost,
        db: 0,
        password: config.redis.redisPassword,
        /*retryStrategy: function (times) {
            const delay = Math.min(times * 2, 2000);
            console.log(util.format('[Logger]::[Redis]::[Service]::[%s]::[Retried...]',
                                      moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')));
            return delay;
        },*/
        connectTimeout: 10000000
    });

    redis.on('+node', data => {
        console.log("redis +node -> "+data);
    });

    redis.on('-node', data => {
        console.log("redis -node -> "+data);
    });

    redis.on('ready', () => {
        console.log("redis ready to connect");
    });

    redis.on('error', err => {
        console.log("redis connection error -> "+err);
    });

    redis.on('node error', err => {
        console.log("redis node error -> "+err);
    });

    redis.on('connect', () => {
        redis.flushdb( function (err, succeeded) {
            console.log(succeeded); // will be true if successfull
        });
    });

    redis.on('reconnecting', delay => {
        console.log("redis reconnecting -> "+delay);
    });

    return {
        getValue: async (key) => {
            return await redis.get(key).then(v => JSON.parse(v)).catch(e => e.message)
        },
        setValue: async (key, value) => {
            const newUser = {
                session: value
            }
            return await redis.set(key, JSON.stringify(newUser)).then(_ => key).catch(e => e.message)
        },
        delKey: async (key) => {
            return await redis.del(key).then(_ => key).catch(e => e.message);
        }
    };
})();

module.exports = RedisModule;