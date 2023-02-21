const mongo = require('mongoose');

dbconnect = async () => {
    try {
        await mongo.connect(process.env.MONGO_CONNECT);
        console.log("database connected");
    } catch (e) {
        console.log("couldn't connect to db e: " + e.message)
    }
}

dbconnect();