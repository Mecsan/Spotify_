const AsyncHandler = require("express-async-handler");
const { song } = require("../models/song");
const { artistmodel } = require("../models/artist");
const { playlist } = require("../models/playlist");
const client = require("../config/redisConnect");
const { redisBase } = require("../helper/constant");

const searchAll = AsyncHandler(async (req, res) => {
    const q = req.query.q;
    let search = new RegExp(q, "i");

    let key = `${redisBase}:search:${search}`;
    let cache = await client.get(key);
    if (cache) {
        return res.json(JSON.parse(cache));
    }

    let songs = await song.find({
        name: { $regex: search },
    }).populate({
        path: "artist",
        select: "name"
    })

    let playLists = await playlist.find({
        name: { $regex: search },
        isPrivate: false
    })

    let artists = await artistmodel.find({
        name: { $regex: search },
    })

    let response = { songs, playLists, artists }
    await client.set(key, JSON.stringify(response))
    await client.expire(key,60);
    
    res.json(response);
})

module.exports = { searchAll }