const mongoose = require('mongoose')
const { Schema } = mongoose

const foodRequestSchema = new Schema({
    uid: {
        type: String,
        unique: true,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('foodRequest', foodRequestSchema)
