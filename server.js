/*
   F-L-A-T-L-A-N-D S-E-R-V-E-R
   Ralf Baecker 2021

   platform collaborative generative practices

*/



const https = require('https');
var http = require('http');
const fs = require('fs');
var ip = require("ip");
console.log("FLATLAND server !");
console.log("serverIP : " + ip.address());


var express = require('express');
var secure = require('express-force-https');
var app = express();

app.use(express.static('public'));
app.use(secure);

var server = http.createServer(app);

const privateKey = fs.readFileSync('/etc/letsencrypt/live/flatland.earth/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/flatland.earth/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/flatland.earth/chain.pem', 'utf8');

var serverSecure = https.createServer({
    key: privateKey,
    cert: certificate,
    ca: ca
}, app);


server.listen(80, () => {
    console.log('HTTP Server running on port 80');
});




serverSecure.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});



var socket = require('socket.io');
var io = socket(serverSecure);
io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log('new connection ' + socket.id);
    socket.on('disconnet', disconnect);
    socket.on('machine', machineMessage);
    socket.on('removemachine', removeMachine);

    function disconnect() {
        console.log('disconnect ' + socket.id);
        socket.broadcast.emit("removeclient", { id: socket.id });
    }

    function machineMessage(data) {
        //  console.log(data);
        socket.broadcast.emit("updateremotemachines", data);
    }

    function removeMachine(data) {
        console.log("removemachine: " + data.machineid);
        socket.broadcast.emit("removemachine", data);
    }

}