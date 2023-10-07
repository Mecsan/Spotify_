const mongo = require('mongoose');
mongo.set("strictQuery", true);

dbconnect = async () => {
    try {
        mongo.connect(process.env.MONGO_CONNECT);
        console.log("mongoDb connected");
    } catch (e) {
        console.log("couldn't connect to mongoDb e: " + e.message)
    }
}

mongo.connection.on("error", (e) => {
    console.log("mongoDb runtime error : " + e)
})

dbconnect();