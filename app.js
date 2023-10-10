var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);


app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
res.sendFile(__dirname+'/public/index.html');
});

var usernames={};

io.sockets.on('connection', function(socket){
    
socket.on('other file', function(data){
socket.broadcast.emit('otherformat', socket.username, data);
});

socket.on('user image', function(data){
socket.broadcast.emit('addimage',socket.username, data)
});

socket.on('sendchat',function(data){
io.sockets.emit('updatechat',socket.username, data);
});


socket.on('adduser',function(username){
socket.username=username;
usernames[username]=username;
socket.emit('updatechat','SERVER','You have connected');
socket.broadcast.emit('updatechat','SERVER', username+ ' has connected');
io.sockets.emit('updateusers', usernames);
});

socket.on('disconnect', function(){
delete usernames[socket.username];
io.sockets.emit('updateusers',usernames);
socket.broadcast.emit('updatechat','SERVER', socket.username + ' has disconnected');
});
});

var port = 1234;
server.listen(port);
console.log("Server is listening to http://localhost:1234")
