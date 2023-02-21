const mongo = require('mongoose');

const userScema = new mongo.Schema({
    name: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    liked: {
        type: [mongo.Schema.Types.ObjectId],
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    logo: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

const user = new mongo.model('users', userScema);

module.exports = { user }