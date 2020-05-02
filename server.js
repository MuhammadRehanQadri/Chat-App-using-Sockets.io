const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

let users = [], sockets = [];

io.on("connection", function(socket) {
    sockets.push(socket);
    console.log("a user connected, total users: ", sockets.length);
    socket.emit('onConnect', {msg: 'Hi'});

    socket.on("message", function(message){
        console.log(`message received: ${JSON.stringify(message)}`);
        io.sockets.emit('message', message);
    });

    socket.on('onJoin', function(data){
        console.log(`Inside onJoin`, data);
        const { username } = data;
        users.push(username);
        socket.username = username;
        io.sockets.emit('message', { msg: username + ' Joined!' });
    });

    socket.on('disconnect', function(socket){
        sockets.splice(sockets.indexOf(socket), 1);
        users.splice(users.indexOf(socket.username), 1);
        console.log(`user disconnected, current active connections`, sockets.length);
    });
});

server.listen(3000, () => console.log("listening on http://localhost:3000"));