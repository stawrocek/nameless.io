const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const socketIO = require('socket.io');

const app = express();

const server = http.Server(app);
const io = socketIO(server);

app.set('view engine', 'ejs');
app.engine("html", ejs.renderFile);
app.set('views', './templates');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('port', 5000);

app.use(express.static(__dirname + '/static/'));
app.use(express.static(__dirname + '/browserjs/'));

app.get('/', (req, res) => {
    var model = {};
    res.render('index.html', model);
});

app.use((req,res,next) => {
  res.end(`404: ${req.url} not found\n`);
});

server.listen(app.get('port'), function(){
  console.log(`server created on port ${app.get('port')}`);
});

let players = {};

io.on('connection', function(socket) {
  console.log('someone connected, show him da wey brotherz');
  socket.on('new_player', function(data) {
    console.log(`wtf ${data.user}`);
    //players[socket.id] = {
    players[data.user] = {
      x: 300,
      y: 300,
      user: data.user
    };
    console.log(`New player:  + ${players[data.user].x}, ${players[data.user].y}, ${players[data.user].user}`);
  });
});

setInterval(function() {
  io.sockets.emit('message', 'hi!');
}, 1000);