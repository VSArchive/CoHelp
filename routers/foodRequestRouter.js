const express = require("express")
const foodRequestRouter = express.Router()
const foodRequestModel = require('../models/foodRequestModel')

foodRequestRouter.get('/', async (req, res) => {
    try {
        const url = await foodRequestModel.find()
        res.send(url)
    } catch (err) {
        console.log(err)
    }
})

foodRequestRouter.get('/delete/:uid', async (req, res) => {
    try {
        await foodRequestModel.deleteOne({ uid: req.params.uid }).then(function () {
            res.redirect("/dashboard")
        })
    } catch (err) {
        console.log(err)
        res.redirect("/dashboard")
    }
})

foodRequestRouter.post('/', async (req, res) => {
    const newFoodRequest = new foodRequestModel({
        uid: req.body.uid,
        displayName: req.body.displayName,
        email: req.body.email,
        phoneNo: req.body.phoneNo,
        address: req.body.address
    })

    try {
        await newFoodRequest.save().then(function () {
            res.redirect("/dashboard")
        })
    } catch (err) {
        console.log(err)
        res.redirect('/dashboard')
    }
})

module.exports = foodRequestRouter