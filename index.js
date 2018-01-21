const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const socketIO = require('socket.io');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const user = require('./model/user');
const sha256 = require('js-sha256').sha256;
const playersModule = require('./serverjs/player');
let Player = playersModule.Player;

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
app.use(session({
    //store: new FileStore({path: "./sessions", logFn: function(){}}),
    secret: "pls send help", resave: true, saveUninitialized: true}));
app.use(cookieParser());

app.set('port', 5000);

app.use(express.static(__dirname + '/static/'));
app.use(express.static(__dirname + '/browserjs/'));

app.get('/', (req, res) => {
    var model = {};
    res.render('index.html', model);
});

app.get('/register', (req, res) => {
  res.render('register.html', {nametaken:false});
});

app.post('/register', (req, res) => {
  let n = req.body.name;
  let p = req.body.password;
  if (user.get(n) != null) {
    res.render('register.html', {nametaken: true});
    return;
  }
  user.create(n, p);
  res.end(`<h1>Congrats ${n}, you are registered! Your password is ${p}</h1>`);
});

app.get('/login', (req, res) => {
  res.render('login.html', {wrong:false});
});

app.post('/login', (req, res) => {
  let n = req.body.name;
  let p = req.body.password;
  u = user.get(n);
  if (u == null || sha256(p) != u.hash) {
    res.render('login.html', {wrong:true});
    return;
  }
  req.session.user = u;
  res.end("<h1>You have successfully logged in!</h1>");
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
        console.log(`new_player ${socket.id}`);
        players[socket.id] = new Player(data.user);
        players[socket.id].print('New player');
    });
    socket.on('movement', function(data) {
        players[socket.id].act(data);
    });
});

setInterval(function() {
    io.sockets.emit('state', players);
}, 1000 / 60);