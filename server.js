const express = require('express');
const socket = require('socket.io');

//Setup the server ---------------------------------------------
const app = express();
const http = require('http');
const hostname = '127.0.0.1'; //localhost
const port = 5000;
const server = http.createServer(app);

app.use( express.static('public') );
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.get("/", (request, response) => {
  response.sendFile(directory_name + "index.html");
});
//--------------------------------------------------------------

//Allow server to use the socket
const io = socket(server);
//Dealing with server events / connection
//...when a new connection is on, run the newConnection function
io.sockets.on('connection', newConnection); //callback

//Function that serves the new connection
function newConnection(socket){
	console.log('New connection: ' + socket.id);

	//When a message arrives from the client, run the eventMessage function
	socket.on('eventFromClient', eventMessage);

	function eventMessage(data){
		socket.broadcast.emit('eventFromServer', data);
		//Following line refers to sending data to all clients
		//io.sockets.emit('mouse', data);
		console.log(data);
	}
}