const Router = require('express').Router();
const upload = require('../config/upload');

const {
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
} = require("../controllers/playlist");

const authenticate = require('../middleware/authmiddleware');
const isOwner = require('../middleware/isOwnerPlaylist');
const validateId = require('../middleware/valiadteId');

Router.get("/", authenticate, getPlayLists);
Router.post("/", authenticate, addPlayList);

Router.get("/all", getAllPlaylists);

Router.get("/like/:id", authenticate, validateId, likePlaylist);
Router.get("/like", authenticate, getlikedList);
Router.get("/:id", validateId, getOnePlayList);


Router.get("/:id/:action", authenticate, validateId, isOwner, changeVisibility)

Router.put("/:id", authenticate, validateId, isOwner, upload.single('image'), updatePlayList);

Router.delete("/:id", authenticate, validateId, isOwner, dltPlayList);

Router.post("/songs/:id/:sid", authenticate, isOwner, addSongToPlaylist);

Router.delete("/songs/:id/:sid", authenticate, isOwner, RemoveSongFromPlaylist);

module.exports = Router;