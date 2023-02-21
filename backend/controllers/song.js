const { song } = require("../models/song");
const { user } = require("../models/user")
const asyncHandler = require("express-async-handler");
const Myerror = require("../helper/customErr");

const { connection, mongo } = require("mongoose");
var gfs, gridBucket;
// to read gridfs files from database 
const gridFs = require("gridfs-stream");


connection.once('open', () => {
    gfs = gridFs(connection, mongo);
    gridBucket = new mongo.GridFSBucket(connection, {
        bucketName: 'images'
    })

})

const getsongs = asyncHandler(async (req, res) => {

    let limit = req.query.limit;
    let songs = await song.find().sort("-createdAt").limit(
        limit ? limit : 0
    ).populate({
        path: "artist",
        name: "logo name"
    });
    res.json(songs);
})

const getOnesong = asyncHandler(async (req, res) => {
    let { id } = req.params;
    let oneSong = await song.findOne({ _id: id }).populate({
        path: "artist",
        select: "name logo"
    });
    res.json(oneSong);
})

const getSongData = asyncHandler(async (req, res) => {
    // song stream api which will directly get audio data from gridfs
    let { name } = req.params;
    gfs.collection("songs");
    let song = await gfs.files.findOne({ filename: name });
    if (!song) throw new Myerror("no song found with name", 400);


    let fileSize = song.length

    let chunkSize = 500000// 500kb 

    gridBucket = new mongo.GridFSBucket(connection, {
        bucketName: 'songs'
    })

    let range = req.headers.range;
    let start = 0, end;



    if (range) {
        arr = range.substring(6).split("-");
        start = parseInt(arr[0], 10);
    }

    end = Math.min(start + chunkSize, fileSize - 1);

    if (start != end) {

        const readstream = gridBucket.openDownloadStream(song._id, { start: start, end: end });
        res.writeHead(206, {
            'Accept-Ranges': 'bytes',
            'Content-Range': 'bytes ' + start + '-' + end + '/' + fileSize,
            'Content-Length': end - start,
            'Content-Type': 'audio/mpeg',
        });

        readstream.pipe(res);
    }else{
        res.end();
    }
})

const addsong = asyncHandler(async (req, res) => {

    // validate the input 

    // validate for already exist song name

    let body = JSON.parse(JSON.stringify(req.body));

    let newsong = new song({
        name: body.name,
        artist: body.artist,
        song: req.files['data'][0].filename,
        image: req.files['photo'][0].filename,
        duration: body.duration
    });
    await newsong.save();

    let fetchsong = await song.findOne({ _id: newsong._id }).populate({
        path: "artist",
        name: "logo name"
    })

    res.json(fetchsong);
})

const dltsong = asyncHandler(async (req, res) => {
    let { id } = req.params;
    let deleted = await song.findOneAndDelete({ _id: id });
    res.json({ msg: id });
})

const updatedsong = asyncHandler(async (req, res) => {
    let { id } = req.params;

    let body = JSON.parse(JSON.stringify(req.body));
    let obj = {
        name: body.name,
        artist: body.artist,
        duration: body.duration
    }

    if (req.files['data']) {
        obj['song'] = req.files['data'][0].filename;
    }

    if (req.files['photo']) {
        obj['image'] = req.files['photo'][0].filename
    }

    // validate req.body
    let newSong = await song.findOneAndUpdate({ _id: id }, obj, { new: true }).populate({
        path: "artist",
        name: "logo name"
    });
    res.json(newSong);
})

const toggleLike = asyncHandler(async (req, res) => {
    let { id } = req.params;
    let check = await user.findOne({ _id: req.user });
    if (check.liked.find((ch) => ch == id)) {
        // remove from like & decrement like count
        let newuser = await user.findOneAndUpdate({ _id: req.user }, {
            $pull: { liked: id }
        }, { new: true })

        let newsong = await song.findOneAndUpdate({ _id: id }, {
            $inc: {
                likes: -1
            }
        })
    } else {
        // add to like & increment like count
        let newuser = await user.findOneAndUpdate({ _id: req.user }, {
            $push: { liked: id }
        }, { new: true })

        let newsong = await song.findOneAndUpdate({ _id: id }, {
            $inc: {
                likes: 1
            }
        })

    }
    res.json({ msg: id })
})

const getLikedsongs = asyncHandler(async (req, res) => {
    let users = await user.findOne({ _id: req.user });
    let likedIds = users.liked;
    let songs = await song.find({
        _id: {
            $in: likedIds
        }
    }).populate({
        path: "artist",
        select: "name"
    })
    res.json(songs);
})


module.exports = {
    getOnesong,
    getSongData,
    getsongs,
    addsong,
    dltsong,
    updatedsong,
    toggleLike,
    getLikedsongs,
}