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
    makePrivate,
    makePublic,
    getadminPlaylists,
    addAdminPlaylist,
    getHomePlaylists,
} = require("../controllers/playlist");

const authenticate = require('../middleware/authmiddleware');
const isadmin = require('../middleware/isadmin');
const validateId = require('../middleware/valiadteId');

Router.get("/", authenticate, getPlayLists);
Router.post("/", authenticate, addPlayList);

Router.get("/home", getHomePlaylists);
Router.get("/admin", authenticate, isadmin, getadminPlaylists);
Router.post("/admin", authenticate, isadmin, addAdminPlaylist)

Router.get("/public/:id", authenticate, makePublic);
Router.get("/private/:id", authenticate, makePrivate);

Router.get("/:id", validateId, getOnePlayList);

Router.put("/:id", authenticate, validateId, upload.single('image'), updatePlayList);

Router.delete("/:id", authenticate, validateId, dltPlayList);

Router.post("/songs/:id/:sid", authenticate, addSongToPlaylist);

Router.delete("/songs/:id/:sid", authenticate, RemoveSongFromPlaylist);

module.exports = Router;