const mongo = require("mongoose");

const songScema = new mongo.Schema({
    name: {
        type: String,
        required: [true, "song name must required"]
    },
    artist: {
        type: mongo.Schema.Types.ObjectId,
        ref: "artists",
        required: [true, "song artist must required"]
    },
    image: {
        type: String,
        required: [true, "song image must required"]
    },
    song: {
        type: String,
        required: [true, "song data must required"]
    },
    duration: {
        type: Number, 
    },
    likes: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
})

const song = new mongo.model('songs', songScema);
module.exports = { song }