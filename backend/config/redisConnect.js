const { createClient } = require('redis');

const client = createClient({
    url: process.env.REDIS_CONNECT
})

client.on('error', (e) => {
    console.log("redis error " + e)
})

client.connect().then(() => {
    console.log("Redis connected")
}).catch((e) => {
    console.log("Redis error while connecting " + e)
})

module.exports = client