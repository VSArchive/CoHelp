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

foodRequestRouter.post('/', async (req, res) => {
    const newFoodRequest = new foodRequestModel({
        uid: req.body.uid,
        displayName: req.body.displayName,
        email: req.body.email,
        address: req.body.address
    })

    try {
        const saveToDB = await newFoodRequest.save()
        res.redirect('/dashboard')
    } catch (err) {
        res.redirect('/dashboard')
    }
})

module.exports = foodRequestRouter