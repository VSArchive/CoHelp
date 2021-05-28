const express = require("express")
const userRouter = express.Router()
const userModel = require('../models/userModel')

userRouter.get('/', async (req, res) => {
    try {
        const url = await userModel.find()
        res.send(url)
    } catch (err) {
        console.log(err)
    }
})

userRouter.get('/save/:uid/:email/:displayName/:photoURL', async (req, res) => {
    const newUser = new userModel({
        uid: req.params.uid,
        displayName: req.params.displayName,
        photoURL: req.params.photoURL,
        email: req.params.email
    })

    try {
        const saveToDB = await newUser.save()
        res.redirect('/dashboard')
    } catch (err) {
        res.redirect('/dashboard')
    }
})

module.exports = userRouter