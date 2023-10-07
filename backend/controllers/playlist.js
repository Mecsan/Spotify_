const { playlist } = require("../models/playlist");
const asyncHandler = require("express-async-handler");
const Myerror = require("../helper/customErr");
const jwt = require("jsonwebtoken");
const { user } = require("../models/user");
const { defultPlaylistImage, redisBase } = require("../helper/constant");
const client = require("../config/redisConnect");

const addPlayList = asyncHandler(async (req, res) => {
    let body = JSON.parse(JSON.stringify(req.body));

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
    let playlists = await playlist.find({ user: req.user });
    res.json(playlists);
})

const getOnePlayList = asyncHandler(async (req, res) => {
    let { id } = req.params;
    let key = `${redisBase}:playlist:${id}`;

    let cache = await client.get(key);
    let playlists;

    if (cache) {
        playlists = JSON.parse(cache);
    } else {
        playlists = await playlist.findOne({ _id: id }).populate({
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
        await client.set(key,JSON.stringify(playlists));
        await client.expire(key,60);
    }

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
    let key = `${redisBase}:playlist:${id}`;

    let deleted = await playlist.deleteOne({ _id: id });
    let deleteFromLiked = await user.updateMany({
        "likedList": id
    }, {
        $pull: { "likedList": id }
    })
    
    await client.del(key);
    res.json({ msg: id })
})

const updatePlayList = asyncHandler(async (req, res) => {
    let { id } = req.params;
    let key = `${redisBase}:playlist:${id}`;

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

    await client.del(key);
    res.json(updated);
})

const changeVisibility = asyncHandler(async (req, res) => {
    let { id, action } = req.params;
    let key = `${redisBase}:playlist:${id}`;

    let private = action == "true" ? true : false;
    let updated = await playlist.findOneAndUpdate({ _id: id }, { isPrivate: private });

    await client.del(key);
    res.json(private);
})

const addSongToPlaylist = asyncHandler(async (req, res) => {
    let { id, sid } = req.params;
    let key = `${redisBase}:playlist:${id}`;

    let already = await playlist.findOne({ _id: id });
    if (already.songs.find(one => one == sid))
        throw new Myerror("Already in " + already.name, 400);

    let playLists = await playlist.findOneAndUpdate({ _id: id }, {
        $push: { songs: sid }
    }, { new: true });

    await client.del(key);
    res.json(playLists);
})

const RemoveSongFromPlaylist = asyncHandler(async (req, res) => {
    let { id, sid } = req.params;
    let key = `${redisBase}:playlist:${id}`;

    let playLists = await playlist.findOneAndUpdate({ _id: id }, {
        $pull: { songs: sid }
    })

    await client.del(key);
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
    let key = `${redisBase}:playlists:all`;
    if(limit){
        key = key +"?limit:"+limit
    }

    let cache = await client.get(key);
    if(cache){
        return res.json(JSON.parse(cache))
    }

    let playlists = await playlist.find({ isPrivate: false }).sort("-createdAt").limit(
        limit ? limit : 0
    );
    await client.set(key,JSON.stringify(playlists));  
    await client.expire(key,60);  
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