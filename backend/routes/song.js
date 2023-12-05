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

Router.get("/", getsongs);

// auth
Router.get("/like", authenticate, getLikedsongs);
//

Router.get("/:id", validateId, getOnesong);

Router.get("/songdata/:name", getSongData);

// auth
Router.post("/like/:id", validateId, authenticate, toggleLike);

//admin
Router.post("/", authenticate, admin, addsong);

Router.delete("/:id", authenticate, admin, validateId, dltsong);

Router.put("/:id", authenticate, admin, validateId, updatedsong);

module.exports = Router;

