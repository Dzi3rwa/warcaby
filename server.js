const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000

app.use(express.static('static'))
app.use(express.json())

let usersTab = []
let moveObject
let Color = "white"
let winColor = ""
let queensTab = []

app.post('/addUser', function (req, res) {
    const userName = req.body.userName
    winColor = ""
    if (usersTab.includes(userName) && usersTab.length < 2) {
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify(""));
    } else {
        if (userName == true) {
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify(usersTab));
        } else {
            usersTab.push(userName)
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify(usersTab));
        }
    }
})

app.post('/pionekMove', function (req, res) {
    const color = req.body.color
    const oldPosition = req.body.pionek
    const newPositionX = req.body.newPositionX
    const newPositionY = req.body.newPositionY
    const newPositionZ = req.body.newPositionZ
    const bityPionek = req.body.bityPionek
    const obj = {
        color: color,
        oldPosition: oldPosition,
        newPosition: {
            x: newPositionX,
            y: newPositionY,
            z: newPositionZ
        },
        bityPionek: bityPionek
    }
    moveObject = obj
    Color = color
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(Color));
})

app.post(`/getMove`, function (req, res) {
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(moveObject));
})

app.post(`/endGame`, function (req, res) {
    const color = req.body.color
    winColor = color
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(color));
})

app.post(`/isEndGame`, function (req, res) {
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(winColor));
})

app.post(`/clearUserTab`, function (req, res) {
    usersTab.length = 0
    moveObject = undefined
    Color = "white"
    queensTab = []
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(usersTab));
})

app.post("/queensTab", function (req, res) {
    if (req.body.queensTab != undefined)
        queensTab.push(req.body.queensTab)
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ queensTab: queensTab }));
})

app.listen(PORT, () => console.log("app listening on 3000"));