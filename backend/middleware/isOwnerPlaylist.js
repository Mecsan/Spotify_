const expressAsyncHandler = require("express-async-handler");
const Myerror = require("../helper/customErr");
const { playlist } = require("../models/playlist");

const isOwner = expressAsyncHandler(async (req, res, next) => {
    let { id } = req.params;
    let info = await playlist.findOne({ _id: id })
    if (info.user == req.user) {
        next();
    } else {
        throw new Myerror("unauthorized access", 405);
    }
})

module.exports = isOwner