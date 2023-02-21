const Router = require('express').Router();
const { signup,
    login,
    info,
    getAllUSer,
    addUser,
    upadteuser,
    deletUser } = require("../controllers/auth");

const authenticated = require("../middleware/authmiddleware");
const admin = require("../middleware/isadmin");

Router.post("/signup", signup);
Router.post("/login", login);

// authenticated
Router.get("/", authenticated, info);

//admin
Router.get("/all", authenticated, admin, getAllUSer);

Router.post("/", authenticated, admin, addUser);

Router.put("/:id", authenticated, admin, upadteuser);

Router.delete("/:id", authenticated, admin, deletUser);

module.exports = Router;