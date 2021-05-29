const mongoose = require('mongoose')
const { Schema } = mongoose

const foodRequestSchema = new Schema({
    fromUID: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    byUID: {
        type: String,
        required: true
    },
    byDisplayName: {
        type: String,
        required: true
    },
    byEmail: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('foodAcceptRequest', foodRequestSchema)
