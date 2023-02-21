const expressAsyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const myerr = require("../helper/customErr");
const { user } = require("../models/user")

let authenticate = expressAsyncHandler(async (req, res, next) => {

    let auth = req.headers['authorization'];
    if (!auth) throw new myerr("authentication required", 401);

    let token = auth.split(" ")[1];
    if (!token) throw new myerr("authentication required", 401);

    try {
        let decode = jwt.verify(token, process.env.JWT_SECRET);
        let userfind = await user.findOne({ _id: decode });
        if (!userfind) throw myerr("user not found", 404);

        req.user = decode;
        next();

    } catch (e) {
        throw new myerr("invalid jwt", 401);
    }
})

module.exports = authenticate;