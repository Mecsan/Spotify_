const AsyncHandler = require("express-async-handler");
const Myerror = require("../helper/customErr");
const { artistmodel } = require("../models/artist");
const { song } = require("../models/song")

const getArtists = AsyncHandler(async (req, res) => {
    const limit = req.query.limit;
    let artists = await artistmodel.find().limit(
        limit ? limit : 0
    );
    res.json(artists);
})

const oneArtist = AsyncHandler(async (req, res) => {
    let { id } = req.params;
    let artist = await artistmodel.findOne({ _id: id });
    if (!artist) throw new Myerror("artist not found", 404);

    let songs = await song.find({
        artist: id
    }).populate({
        path: "artist",
        select: "name"
    })
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
    res.json(artist);
})

const dltArtist = AsyncHandler(async (req, res) => {
    let { id } = req.params
    await artistmodel.deleteOne({ _id: id });
    await song.deleteMany({ artist: id });
    res.json(id);
})

module.exports = {
    getArtists,
    oneArtist,
    addArtist,
    updateArtist,
    dltArtist
}