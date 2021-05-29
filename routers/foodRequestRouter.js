const express = require("express")
const foodRequestRouter = express.Router()
const foodRequestModel = require('../models/foodRequestModel')
const foodAcceptRequestModel = require('../models/foodAcceptRequestModel')
const userModel = require('../models/userModel')

foodRequestRouter.get('/requested', async (req, res) => {
    try {
        const url = await foodRequestModel.find()
        res.send(url)
    } catch (err) {
        console.log(err)
    }
})

foodRequestRouter.get('/accepted/:uid', async (req, res) => {
    try {
        const url = await foodAcceptRequestModel.find({ byUID: req.params.uid })
        res.send(url)
    } catch (err) {
        console.log(err)
    }
})

foodRequestRouter.get('/delete/:uid', async (req, res) => {
    try {
        await foodRequestModel.deleteOne({ uid: req.params.uid }).then(function () {
            res.redirect("/dashboard/" + req.params.uid)
        })
    } catch (err) {
        console.log(err)
        res.redirect("/dashboard/" + req.params.uid)
    }
})

foodRequestRouter.get('/deleteAccepted/:uid', async (req, res) => {
    try {
        await foodAcceptRequestModel.deleteOne({ fromUID: req.params.uid }).then(function () {
            res.redirect("/dashboard")
        })
    } catch (err) {
        console.log(err)
        res.redirect("/dashboard/" + req.params.uid)
    }
})

foodRequestRouter.get('/accepted/:byUID/:fromUID', async (req, res) => {
    const request = await foodRequestModel.findOne({ uid: req.params.fromUID })
    const requestUser = await userModel.findOne({ uid: req.params.byUID })
    await foodRequestModel.deleteOne({ uid: req.params.fromUID })
    try {
        const newFoodAcceptRequest = new foodAcceptRequestModel({
            fromUID: request.uid,
            displayName: request.displayName,
            email: request.email,
            phoneNo: request.phoneNo,
            address: request.address,
            byUID: req.params.byUID,
            byDisplayName: requestUser.displayName,
            byEmail: requestUser.email
        })
        try {
            await newFoodAcceptRequest.save().then(function () {
                res.redirect("/mail/" + request.email + "/" + requestUser.email)
            })
        } catch (err) {
            console.log(err)
        }
    } catch (err) {
        console.log(err)
        await request.save()
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