const { Queue } = require("bullmq")
const { song } = require("../models/song");
const { user } = require("../models/user")
const asyncHandler = require("express-async-handler");
const Myerror = require("../helper/customErr");

const { connection, mongo } = require("mongoose");
const { playlist } = require("../models/playlist");
const { redisBase } = require("../helper/constant");
const client = require("../config/redisConnect");


let redisConnection = {
    username: "default",
    password: "kbtd1WvlSNe0QvwcYQX0AsGB6fU5M9mP",
    host: "redis-16710.c212.ap-south-1-1.ec2.cloud.redislabs.com",
    port: 16710
}

const processingQueue = new Queue(`${redisBase}:subtitles`, {
    connection: redisConnection
})

const getsongs = asyncHandler(async (req, res) => {

    let limit = req.query.limit;
    let key = `${redisBase}:songs:all`;
    let data ={
        token :"dhsjhdjs",
        name :"sanket"
    }
    if (limit) {
        key = key + "?limit:" + limit
    }
    let cache = await client.get(key);
    if (cache) {
        return res.json(JSON.parse(cache));
    }

    let songs = await song.find().sort("-createdAt").limit(
        limit ? limit : 0
    ).populate({
        path: "artist",
        name: "logo name"
    });

    await client.set(key, JSON.stringify(songs));
    await client.expire(key, 60);

    res.json(songs);
})

const getOnesong = asyncHandler(async (req, res) => {
    let { id } = req.params;
    let key = `${redisBase}:song:${id}`;
    let cache = await client.get(key);
    if (cache) {
        return res.json(JSON.parse(cache));
    }

    let oneSong = await song.findOne({ _id: id }).populate({
        path: "artist",
        select: "name logo"
    });
    await client.set(key, JSON.stringify(oneSong));
    res.json(oneSong);
})

const getSongData = asyncHandler(async (req, res) => {

    // song stream api which will directly get audio data from gridfs
    let { name } = req.params;
    let songBucket = new mongo.GridFSBucket(connection, {
        bucketName: 'songs'
    })
    let cursor = songBucket.find({ filename: name }).toArray();
    let song = await cursor;
    song = song[0];

    if (!song) throw new Myerror("no song found with name", 404);

    let fileSize = song.length

    let chunkSize = 100000// 100kb 

    let range = req.headers.range;
    let start = 0, end;

    if (range) {
        arr = range.substring(6).split("-");
        start = parseInt(arr[0], 10);
    }

    end = Math.min(start + chunkSize, fileSize - 1);

    if (start >= end) {
        return res.end();
    }

    const readstream = songBucket.openDownloadStreamByName(name, { start: start, end: end });
    res.writeHead(206, {
        'Accept-Ranges': 'bytes',
        'Content-Range': 'bytes ' + start + '-' + end + '/' + fileSize,
        'Content-Length': end - start,
        'Content-Type': 'audio/mpeg',
    });

    readstream.pipe(res);

    readstream.on("error", (e) => {
        console.log(e);
        res.send(e);
    })
})

const addsong = asyncHandler(async (req, res) => {

    let body = JSON.parse(JSON.stringify(req.body));

    let newsong = new song({
        name: body.name,
        artist: body.artist,
        song: req.files['data'][0].filename,
        image: req.files['photo'][0].filename,
        duration: body.duration
    });

    await newsong.save();

    // processingQueue.add("generating subtitles for " + newsong.name, newsong.toObject());

    let fetchsong = await song.findOne({ _id: newsong._id }).populate({
        path: "artist",
        name: "logo name"
    })

    let key = `${redisBase}:artist:${body.artist}`;
    await client.del(key);
    res.json(fetchsong);
})

const dltsong = asyncHandler(async (req, res) => {
    let { id } = req.params;
    let deleted = await song.findOneAndDelete({ _id: id });
    let dltFromPlaylist = await playlist.updateMany({ "songs": id }, {
        $pull: { "songs": id }
    })

    let dltFromLiked = await user.updateMany({ "liked": id }, {
        $pull: { "liked": id }
    })

    let key = `${redisBase}:artist:${deleted.artist}`;
    await client.del(key);

    let songKey = `${redisBase}:song:${id}`;
    await client.del(songKey);

    res.json({ msg: id });
})

const updatedsong = asyncHandler(async (req, res) => {
    let { id } = req.params;
    let key = `${redisBase}:song:${id}`;

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

    let newSong = await song.findOneAndUpdate({ _id: id }, obj, { new: true }).populate({
        path: "artist",
        name: "logo name"
    });

    processingQueue.add("generating subtitles for " + newSong.name, newSong.toObject());

    await client.del(key);
    res.json(newSong);
})

const toggleLike = asyncHandler(async (req, res) => {
    let { id } = req.params;
    let check = await user.findOne({ _id: req.user });
    if (check.liked.find((ch) => ch == id)) {
        // remove from like 
        let newuser = await user.findOneAndUpdate({ _id: req.user }, {
            $pull: { liked: id }
        }, { new: true })
    } else {
        // add to like 
        let newuser = await user.findOneAndUpdate({ _id: req.user }, {
            $push: { liked: id }
        }, { new: true })
    }
    res.json({ msg: id })
})

const getLikedsongs = asyncHandler(async (req, res) => {
    let users = await user.findOne({ _id: req.user }).populate({
        path: "liked",
        populate: {
            path: "artist",
            select: "name"
        }
    });

    let songs = users.liked;
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