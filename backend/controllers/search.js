const AsyncHandler = require("express-async-handler");
const { song } = require("../models/song");
const { artistmodel } = require("../models/artist");
const { playlist } = require("../models/playlist")

const search = AsyncHandler(async (req, res) => {
    const q = req.query.q;
    let search = new RegExp(q, "i");

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

    res.json({ songs, playLists, artists });
})

module.exports = { search }