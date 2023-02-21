const asyncHandler = require("express-async-handler");
var gfs, gridBucket;
const { connection, mongo } = require("mongoose");
const gridFs = require("gridfs-stream");
const Myerror = require("./customErr")

connection.once('open', () => {
    gfs = gridFs(connection, mongo);
    gridBucket = new mongo.GridFSBucket(connection, {
        bucketName: 'images'
    })
    gfs.collection("images");
})

const getSongImage = asyncHandler(async (req, res) => {
    let { name } = req.params;
    let img = await gfs.files.findOne({ filename: name });
    if (!img) throw new Myerror("no image found with name", 400);
    gridBucket = new mongo.GridFSBucket(connection, {
        bucketName: 'images'
    })
    const readstream = gridBucket.openDownloadStream(img._id);
    res.setHeader('content-Type', 'image/jpeg');
    readstream.pipe(res);
})


module.exports = getSongImage