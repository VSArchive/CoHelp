const express = require('express')
const bodyParser = require("body-parser")
const admin = require("firebase-admin")
const cookieParser = require("cookie-parser")
require('dotenv').config()

const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(cookieParser())

var key = process.env.KEY

admin.initializeApp({
    credential: admin.credential.cert({
        "private_key": key.replace(/\\n/g, '\n'),
        "client_email": "firebase-adminsdk-lzyl9@cohelp-hackon.iam.gserviceaccount.com",
        "project_id": "cohelp-hackon"
    })
})

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/logout', (req, res) => {
    res.clearCookie('__session')
    res.redirect('/')
})

app.get('/dashboard', checkCookie, (req, res) => {
    res.render('dashboard')
})

app.get('/savecookie', (req, res) => {
    const idToken = req.query.idToken
    savecookie(idToken, res)
})

function savecookie(idToke, res) {
    const expiresIn = 60 * 60 * 24 * 5 * 1000
    admin.auth().createSessionCookie(idToke, { expiresIn })
        .then((sessionCookie) => {
            const options = { maxAge: expiresIn, httpOnly: true, secure: true }
            res.cookie('__session', sessionCookie, options)

            admin.auth().verifyIdToken(idToke).then(function (decodedClaims) {
                res.redirect('/dashboard')
            })
        }, error => {
            console.log(error)
            res.status(401).send("UnAuthorized Request")

        })
}


function checkCookie(req, res, next) {
    const sessionCookie = req.cookies.__session || ''
    admin.auth().verifySessionCookie(
        sessionCookie, true).then((decodedClaims) => {
            req.decodedClaims = decodedClaims
            next()
        })
        .catch(error => {
            res.redirect('/login')
        })
}

app.listen(process.env.PORT || 3000)
