const mongo = require('mongoose');

const playlistScema = new mongo.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        default: ""
    },
    user: {
        type: mongo.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    image: {
        type: String,
        default: ""
    },
    isPrivate: {
        type: Boolean,
        default: true
    },
    songs: {
        type: [mongo.Schema.Types.ObjectId],
        ref: "songs",
        default: []
    }
}, {
    timestamps: true
})

const playlist = new mongo.model('playlists', playlistScema);

module.exports = { playlist }