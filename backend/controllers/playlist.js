const { playlist } = require("../models/playlist");
const asyncHandler = require("express-async-handler");
const Myerror = require("../helper/customErr");
const jwt = require("jsonwebtoken");

const addPlayList = asyncHandler(async (req, res) => {
    let length = await playlist.countDocuments({ user: req.user, isAdmin: false });
    let play = new playlist({
        name: "playlist #" + (length + 1),
        user: req.user,
        image: "1667666762403.jpeg"
    })

    await play.save();
    res.json(play);
})

const getPlayLists = asyncHandler(async (req, res) => {
    let playlists = await playlist.find({ user: req.user, isAdmin: false });
    res.json(playlists);
})

const getOnePlayList = asyncHandler(async (req, res) => {
    let { id } = req.params;

    let playlists = await playlist.findOne({ _id: id }).populate({
        path: "songs",
        select: "name image artist song duration likes",
        populate: {
            path: "artist",
            select: "name"
        }
    }).populate({
        path: "user",
        select: "name"
    })

    let resObj = {
        playlists: playlists
    };

    let auth = req.headers['authorization'];
    let token = auth?.split(" ")[1];

    if (playlists?.isAdmin) {
        resObj['permission'] = false;
        return res.json(resObj);
    }

    if (!token) {
        resObj['permission'] = false;
        return res.json(resObj);
    }

    let decode = jwt.verify(token, process.env.JWT_SECRET);
    if (decode == playlists.user._id) {
        resObj['permission'] = true;
        return res.json(resObj);
    }

    resObj['permission'] = false;
    res.json(resObj);
})

const dltPlayList = asyncHandler(async (req, res) => {

    let { id } = req.params;
    // checking for permission that this playlist belongs  current login user 
    let deleted = await playlist.deleteOne({ _id: id });
    res.json({ msg: id })
})

const updatePlayList = asyncHandler(async (req, res) => {

    // checking for permission that this playlist belongs  current login user 

    let { id } = req.params;

    let body = JSON.parse(JSON.stringify(req.body));

    let obj = {
        name: body.name,
        desc: body.desc
    }

    if (req.file) {
        obj['image'] = req.file.filename
    }

    let updated = await playlist.findOneAndUpdate({ _id: id }, obj, { new: true }).populate({
        path: "songs",
        select: "name image artist"
    });;

    res.json(updated);
})

const addSongToPlaylist = asyncHandler(async (req, res) => {

    // checking for permission that this playlist belongs  current login user 

    let { id, sid } = req.params;

    let already = await playlist.findOne({ _id: id });
    if (already.songs.find(one => one == sid))
        throw new Myerror("Already in " + already.name, 400);

    let playLists = await playlist.findOneAndUpdate({ _id: id }, {
        $push: { songs: sid }
    }, { new: true });

    res.json(playLists);
})

const RemoveSongFromPlaylist = asyncHandler(async (req, res) => {
    let { id, sid } = req.params;

    let playLists = await playlist.findOneAndUpdate({ _id: id }, {
        $pull: { songs: sid }
    })

    res.json(sid);
})


const makePrivate = asyncHandler(async (req, res) => {
    let { id } = req.params;
    let newu = await playlist.findOneAndUpdate({ _id: id }, { isPrivate: true }, { new: true });
    res.json({ msg: id })
})

const makePublic = asyncHandler(async (req, res) => {
    let { id } = req.params;
    let newu = await playlist.findOneAndUpdate({ _id: id }, { isPrivate: false }, { new: true });
    res.json({ msg: id })
})

const getHomePlaylists = asyncHandler(async (req, res) => {
    const limit = req.query.limit
    let playlists = await playlist.find({ isAdmin: true, isPrivate: false }).sort("-createdAt").limit(
        limit ? limit : 0
    );
    res.json(playlists);
})

const getadminPlaylists = asyncHandler(async (req, res) => {
    const playlistss = await playlist.find({ isAdmin: true }).sort("-createdAt");
    res.json(playlistss);
})


const addAdminPlaylist = asyncHandler(async (req, res) => {
    let length = await playlist.countDocuments({ isAdmin: true });
    let play = new playlist({
        name: "playlist #" + (length + 1),
        user: req.user,
        image: "1667666762403.jpeg",
        isAdmin: true,
    })
    await play.save();
    res.json(play);
})

module.exports = {
    addPlayList,
    getPlayLists,
    dltPlayList,
    updatePlayList,
    getOnePlayList,
    addSongToPlaylist,
    RemoveSongFromPlaylist,
    getHomePlaylists,
    makePrivate,
    makePublic,
    getadminPlaylists,
    addAdminPlaylist
}