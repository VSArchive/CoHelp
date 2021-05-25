const express = require('express')
const admin = require('firebase-admin')
const mongoose = require('mongoose')
const router = require('./routers/userRouter')
const axios = require('axios')
require('dotenv').config()

const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('/user', router)

var key = process.env.KEY

admin.initializeApp({
    credential: admin.credential.cert({
        "private_key": key.replace(/\\n/g, '\n'),
        "client_email": "firebase-adminsdk-lzyl9@cohelp-hackon.iam.gserviceaccount.com",
        "project_id": "cohelp-hackon"
    })
})

mongoose.connect(
    process.env.MongoDB,
    {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => {
        console.log("connected")
    }
)

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

app.listen(process.env.PORT || 3000)
