const mongo = require('mongoose');
mongo.set("strictQuery", true)
dbconnect = async () => {
    try {
        await mongo.connect(process.env.MONGO_CONNECT);
        console.log("database connected");
    } catch (e) {
        console.log("couldn't connect to db e: " + e.message)
    }
}

dbconnect();