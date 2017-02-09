const path = require('path');
const http = require('http');
const express = require('express');
const publicFolder = path.join(__dirname, '/../public');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');

var app = express();
var port = process.env.PORT || 3000;
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicFolder));

io.on('connection', (socket) => {
  console.log('New user connected!');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat room!'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user is joined to this chat room!'));


  socket.on('createMessage', (message, callback) => {
    console.log('createMessage: ', message);

    io.emit('newMessage', generateMessage(message.from, message.text));

    callback('server got it!!');
  });

  socket.on('createLocationMessage', (location) => {
    io.emit('newMessage', generateMessage('Location', `${location.latitude}, ${location.longitude}`));
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is up and running on port: ${port}`);
});
