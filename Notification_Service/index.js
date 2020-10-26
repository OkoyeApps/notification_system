const keys = require('./keys');
const redis = require('redis');

const redisCLient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const sub = redisCLient.duplicate();

sub.on('message', (channel, message) => {
    console.log(channel, message)
})

sub.subscribe('add_notification');
console.log("notification server live");