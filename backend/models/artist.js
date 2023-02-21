const mongo = require('mongoose');

let artist = new mongo.Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String,
    }
})

const artistmodel = new mongo.model("artists", artist);

module.exports = { artistmodel }

