const Router = require('express').Router();
const upload = require('../config/upload');
const { signup,
    login,
    info,
    getAllUSer,
    addUser,
    upadteuser,
    deletUser,
    verifyToken,
    updateProfile } = require("../controllers/auth");

const authenticated = require("../middleware/authmiddleware");
const admin = require("../middleware/isadmin");

Router.post("/signup", signup);
Router.post("/login", login);

Router.get("/token", authenticated, verifyToken)
Router.put('/update', authenticated, upload.single('image'), updateProfile)
Router.get("/:id", info);

//admin
Router.get("/all", authenticated, admin, getAllUSer);

Router.post("/", authenticated, admin, addUser);

Router.put("/:id", authenticated, admin, upadteuser);

Router.delete("/:id", authenticated, admin, deletUser);

module.exports = Router;