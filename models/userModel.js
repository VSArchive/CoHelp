const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    uid: {
        type: String,
        unique: true,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    photoURL: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    }
})

module.exports = mongoose.model('user', userSchema)
