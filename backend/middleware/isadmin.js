const expressAsyncHandler = require("express-async-handler");
const { user } = require('../models/user');
const myerr = require("../helper/customErr")

module.exports = expressAsyncHandler(async (req, res, next) => {

    let admin = await user.findOne({ _id: req.user });
    if (admin?.isAdmin == true) {
        next();
    } else {
        throw new myerr("admin permission required", 401);
    }
})