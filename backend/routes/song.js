const Router = require('express').Router();
const {
    getOnesong,
    getsongs,
    addsong,
    dltsong,
    updatedsong,
    toggleLike,
    getLikedsongs,
    getSongData,
} = require("../controllers/song");

const validateId = require("../middleware/valiadteId");
const authenticate = require("../middleware/authmiddleware");
const admin = require("../middleware/isadmin");
const upload = require('../config/upload');

Router.get("/", getsongs);

// auth
Router.get("/like", authenticate, getLikedsongs);
//

Router.get("/:id", validateId, getOnesong);

Router.get("/songdata/:name", getSongData);

// auth
Router.post("/like/:id", validateId, authenticate, toggleLike);

//admin
Router.post("/", authenticate, admin,
    upload.fields([
        { name: 'photo', maxCount: 1 },
        { name: 'data', maxCount: 1 }
    ]),
    addsong);

Router.delete("/:id", authenticate, admin, validateId, dltsong);

Router.put("/:id", authenticate, admin, validateId, upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'data', maxCount: 1 }
]), updatedsong);

module.exports = Router;

