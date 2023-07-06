const asyncHandler = require("express-async-handler");
const { connection, mongo } = require("mongoose");

const getSongImage = asyncHandler(async (req, res) => {
    let { name } = req.params;
    let gridBucket = new mongo.GridFSBucket(connection, {
        bucketName: 'images'
    })
    const readstream = gridBucket.openDownloadStreamByName(name);
    readstream.on('error', (e) => {
        console.log(e);
        res.send(e);
    })
    res.setHeader('content-Type', 'image/jpeg');
    readstream.pipe(res);
})


module.exports = getSongImage