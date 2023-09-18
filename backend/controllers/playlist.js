const { playlist } = require("../models/playlist");
const asyncHandler = require("express-async-handler");
const Myerror = require("../helper/customErr");
const jwt = require("jsonwebtoken");
const { user } = require("../models/user");
const { defultPlaylistImage } = require("../helper/constant");

const addPlayList = asyncHandler(async (req, res) => {
    let body = JSON.parse(JSON.stringify(req.body));
    console.log(body);

    let obj = {
        name: body.name || "playlist",
        desc: body.desc || "",
        image: req?.file?.filename || defultPlaylistImage,
        user: req.user,
    }

    let play = new playlist(obj);
    await play.save();
    res.json(play);
})

const getPlayLists = asyncHandler(async (req, res) => {
    let playlists = await playlist.find({ user: req.user});
    res.json(playlists);
})

const getOnePlayList = asyncHandler(async (req, res) => {
    let { id } = req.params;

    let playlists = await playlist.findOne({ _id: id }).populate({
        path: "songs",
        select: "name image artist song duration",
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
    let deleted = await playlist.deleteOne({ _id: id });
    let deleteFromLiked = await user.updateMany({
        "likedList": id
    }, {
        $pull: { "likedList": id }
    })

    res.json({ msg: id })
})

const updatePlayList = asyncHandler(async (req, res) => {

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
        select: "name image artist song duration "
    }).populate({
        path: "user"
    })

    res.json(updated);
})

const changeVisibility = asyncHandler(async (req, res) => {
    let { id, action } = req.params;
    let private = action == "true" ? true : false;
    let updated = await playlist.findOneAndUpdate({ _id: id }, { isPrivate: private });
    res.json(private);
})

const addSongToPlaylist = asyncHandler(async (req, res) => {

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

const likePlaylist = asyncHandler(async (req, res) => {
    let { id } = req.params;
    let users = await user.findOne({ _id: req.user });

    if (users.likedList.find((ch) => ch == id)) {
        // remove from like 
        let newuser = await user.findOneAndUpdate({ _id: req.user }, {
            $pull: { likedList: id }
        }, { new: true })
        res.json({ msg: id, like: false })

    } else {
        // add to like 
        let newuser = await user.findOneAndUpdate({ _id: req.user }, {
            $push: { likedList: id }
        }, { new: true })
        res.json({ msg: id, like: true })
    }
})

const getlikedList = asyncHandler(async (req, res) => {
    let users = await user.findOne({ _id: req.user }).populate({
        path: "likedList"
    });
    let lists = users.likedList;
    res.json(lists);
})

const getAllPlaylists = asyncHandler(async (req, res) => {
    const limit = req.query.limit
    let playlists = await playlist.find({ isPrivate: false }).sort("-createdAt").limit(
        limit ? limit : 0
    );
    res.json(playlists);
})



module.exports = {
    addPlayList,
    getPlayLists,
    dltPlayList,
    updatePlayList,
    getOnePlayList,
    addSongToPlaylist,
    RemoveSongFromPlaylist,
    getAllPlaylists,
    likePlaylist,
    getlikedList,
    changeVisibility
}