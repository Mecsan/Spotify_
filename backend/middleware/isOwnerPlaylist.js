const expressAsyncHandler = require("express-async-handler");
const Myerror = require("../helper/customErr");
const { playlist } = require("../models/playlist");
const { user:usermodel } = require("../models/user");

const isOwner = expressAsyncHandler(async (req, res, next) => {
    let { id } = req.params;
    let info = await playlist.findOne({ _id: id })
    let user = await usermodel.findOne({_id:req.user})
    if (info.user == req.user || user.isAdmin) {
        next();
    } else {
        throw new Myerror("unauthorized access", 405);
    }
})

module.exports = isOwner