const jwt = require('jsonwebtoken');
const bcry = require('bcrypt');
const asyncHandler = require("express-async-handler");
const { user } = require("../models/user");
const myerr = require("../helper/customErr");

const signup = asyncHandler(async (req, res) => {

    // validate body before entering in db

    let { email, password, name } = req.body;

    let exist = await user.findOne({ mail: email });
    if (exist) throw new myerr(JSON.stringify({ msg: "user already exist", field: "email" }), 409);

    // hash password

    let salt = await bcry.genSalt();
    let hash = await bcry.hash(password, salt);

    // store in db

    let newuser = new user({
        mail: email,
        password: hash,
        name: name,
        isAdmin:false,
    })

    await newuser.save();

    // generating jwt 

    const encode = jwt.sign(newuser._id.valueOf(), process.env.JWT_SECRET);

    res.json({ success: true, msg: encode });
})

const login = asyncHandler(async (req, res) => {

    // validate body before searching in db
    let { email, password } = req.body;

    let find = await user.findOne({ mail: email });
    if (!find) throw new myerr(JSON.stringify({ msg: "user not found", field: "email" }), 404);

    // matching password

    let check = await bcry.compare(password, find.password);
    if (!check) throw new myerr(JSON.stringify({ msg: "incorrect password", field: "password" }), 401);

    // generating jwt 

    const encode = jwt.sign(find._id.valueOf(), process.env.JWT_SECRET);

    res.json({ success: true, msg: encode });
})

const info = asyncHandler(async (req, res) => {
    let userinfo = await user.findOne({ _id: req.user }).select("-password -liked");
    res.json(userinfo);
})

const getAllUSer = asyncHandler(async (req, res) => {
    let users = await user.find().select("-password -liked").sort("-createdAt");
    res.json(users);
})

const addUser = asyncHandler(async (req, res) => {
    let { name, mail, password } = req.body;
    let exist = await user.findOne({ mail: mail });
    if (exist) throw new myerr( "user already exist", 409);

    let salt = await bcry.genSalt();
    let hash = await bcry.hash(password, salt);

    let newuser = new user({
        mail: mail,
        password: hash,
        name: name,
        isAdmin: req.body.isAdmin
    })

    await newuser.save();
    res.json(newuser);
})

const upadteuser = asyncHandler(async (req, res) => {
    let { id } = req.params;
    let newUser = await user.findOneAndUpdate({ _id: id }, req.body, { new: true });
    res.json(newUser);
})

const deletUser = asyncHandler(async (req, res) => {
    let { id } = req.params;
    await user.deleteOne({ _id: id });
    res.json({ msg: id });
})

module.exports = { signup, login, info, getAllUSer, addUser, upadteuser, deletUser }