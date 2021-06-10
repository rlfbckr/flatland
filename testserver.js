var express = require('express')
var fs = require('fs')
var https = require('https')
var app = express()

app.get('/', function(req, res) {
    res.send('hello world')
})

https.createServer({
        key: fs.readFileSync('/home/pi/server.key'),
        cert: fs.readFileSync('/home/pi/server.cert')
    }, app)
    .listen(80, function() {
        console.log('Example app listening on port 80! Go to https://localhost:3000/')
    })