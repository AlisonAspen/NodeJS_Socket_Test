const express = require('express');
const socket = require('socket.io');

let app = express();

let server = app.listen(5000); //create server to port 5000

app.use(express.static('public'));

console.log("Node is running on port 5000...");

const io = socket(server);

io.sockets.on('connection', newCOnnection);

function newConnection(socket) {
    console.log("New connection: " + socket.id);

    socket.on('eventFromClient', eventMessage);

    function eventMessage(data) {
        socket.broadcast.emit('eventFromServer', data);
        //send data to all clients
        //io.sockets.emit('mouse', data);
        console.log(data);
    }
}