const express = require("express")
const router = express.Router()
const userModel = require('../models/userModel')

router.get('/', async (req, res) => {
    try {
        const url = await userModel.find()
        res.send(url)
    } catch (err) {
        console.log(err)
    }
})

router.get('/save/:uid/:email/:displayName/:photoURL', async (req, res) => {
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
        res.send(err)
    }
})

module.exports = router