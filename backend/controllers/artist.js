const AsyncHandler = require("express-async-handler");
const client = require("../config/redisConnect");
const { redisBase } = require("../helper/constant");
const Myerror = require("../helper/customErr");
const { artistmodel } = require("../models/artist");
const { song } = require("../models/song")

const getArtists = AsyncHandler(async (req, res) => {
    const limit = req.query.limit;
    let key = `${redisBase}:artists:all`;
    if (limit) {
        key = key + "?limit:" + limit
    }

    let cache = await client.get(key);
    if (cache) {
        return res.json(JSON.parse(cache))
    }

    let artists = await artistmodel.find().limit(
        limit ? limit : 0
    );

    await client.set(key, JSON.stringify(artists));
    await client.expire(key,60);
    res.json(artists);
})

const oneArtist = AsyncHandler(async (req, res) => {
    let { id } = req.params;
    let key = `${redisBase}:artist:${id}`;

    let cache = await client.get(key);
    if (cache) {
        return res.json(JSON.parse(cache));
    }

    let artist = await artistmodel.findOne({ _id: id });
    if (!artist) throw new Myerror("artist not found", 404);

    let songs = await song.find({
        artist: id
    }).populate({
        path: "artist",
        select: "name"
    })

    await client.set(key, JSON.stringify({ artist, songs }))
    res.json({ artist, songs });
})

const addArtist = AsyncHandler(async (req, res) => {
    let body = JSON.parse(JSON.stringify(req.body));
    if (req.file) {
        body['logo'] = req.file.filename
    }
    let artist = new artistmodel(body);
    await artist.save();
    res.json(artist);
})

const updateArtist = AsyncHandler(async (req, res) => {
    let { id } = req.params
    

    let body = JSON.parse(JSON.stringify(req.body));
    if (req.file) {
        body['logo'] = req.file.filename
    }
    let artist = await artistmodel.findOneAndUpdate({ _id: id }, body, { new: true });

    let key = `${redisBase}:artist:${id}`;
    await client.del(key);

    res.json(artist);
})

const dltArtist = AsyncHandler(async (req, res) => {
    let { id } = req.params;
    await artistmodel.deleteOne({ _id: id });
    await song.deleteMany({ artist: id });

    let key = `${redisBase}:artist:${id}`;
    await client.del(key);
    
    // use message queue for deleting all the cache song of artist
    res.json(id);
})

module.exports = {
    getArtists,
    oneArtist,
    addArtist,
    updateArtist,
    dltArtist
}