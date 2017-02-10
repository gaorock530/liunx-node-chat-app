const path = require('path');
const http = require('http');
const express = require('express');
const publicFolder = path.join(__dirname, '/../public');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicIP = require('public-ip');

publicIP.v4().then(ip => {
  console.log(ip);
});



var app = express();
var port = process.env.PORT || 3000;
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicFolder));
// app.set('view engine', 'hbs');
// app.get('/', (req, res) => {
//   res.render("index");
// });

io.on('connection', (socket) => {


  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback();
  });

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)){
      return callback('err');
    } else{
      socket.join(params.room);
      users.removeUser(socket.id);
      users.addUser(socket.id, params.name, params.room);
      //socket.leave(params.room);
      //io.emit -> io.to(params.room);
      //socket.broadcast.emit -> socket.broadcast.to(params.room).emit;
      //socket.emit
      io.to(params.room).emit('updateUserList', users.getUserList(params.room));
      socket.emit('newMessage', generateMessage('SYSTEM', 'Welcome to the Chat room!'));
      socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined to this chat room!`));
      callback();
    }
  });

  socket.on('updateUser', (info) => {
    if (typeof info === 'object'){
      var user = users.updateUser(socket.id, info);
      io.to(user.room).emit('showLocation', user.info);
    }
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} has left.`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up and running on port: ${port}`);
});
