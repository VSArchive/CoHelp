const express = require('express')
const admin = require('firebase-admin')
const mongoose = require('mongoose')
var bodyParser = require("body-parser")
const userRouter = require('./routers/userRouter')
const foodRequestRouter = require('./routers/foodRequestRouter')
const axios = require('axios')
require('dotenv').config()

const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server, {
    debug: true
})
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/user', userRouter)
app.use('/food', foodRequestRouter)
app.use('/peerjs', peerServer)

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
    res.render('dashboard', { foodRequests: [], foodAcceptRequests: [] })
})

app.get('/dashboard/:uid', (req, res) => {
    const foodRequestUrl = req.protocol + '://' + req.get('host') + '/food/requested'
    const foodAcceptRequestUrl = req.protocol + '://' + req.get('host') + '/food/accepted/' + req.params.uid
    axios.get(foodRequestUrl)
        .then(res => res.data)
        .then((foodRequests) => {
            axios.get(foodAcceptRequestUrl)
                .then(res => res.data)
                .then((foodAcceptRequests) => {
                    res.render('dashboard', { foodRequests: foodRequests, foodAcceptRequests: foodAcceptRequests })
                })
        })
})

app.get('/meet', (req, res) => {
    res.redirect(`/meet/${uuidV4()}`)
})

app.get('/meet/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

app.get('/mail/:toEmail/:accepterEmail', (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })

    const name = req.body.name
    const email = req.body.email
    const subject = req.body.subject

    const mailOptions = {
        from: email,
        to: 'vineelsai26@gmail.com',
        subject: 'From Website Contact Form By : ' + name,
        text: subject + '\n\n\n' + email
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
            res.render('mail', { success: false })
        } else {
            console.log('Email sent')
            res.render('mail', { success: true })
        }
    })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
        socket.on('message', (message) => {
            io.to(roomId).emit('createMessage', message)
        })

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(process.env.PORT || 3000)
