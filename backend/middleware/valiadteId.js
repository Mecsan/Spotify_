const mongo = require("mongoose");
const myerr = require("../helper/customErr")

const validateId = (req, res, next) => {
    let { id } = req.params;
    if (mongo.Types.ObjectId.isValid(id)) {
        next();
    } else {
        throw new myerr("invalid id", 404);
    }

}

module.exports = validateId;