const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const io = require('socket.io')(http);;

var app = express();

app.set('view engine', 'ejs');
app.engine("html", ejs.renderFile);
app.set('views', './templates');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/static/'));
app.use(express.static(__dirname + '/browserjs/'));

app.get('/', (req, res) => {
    var model = {};
    res.render('index.html', model);
});

io.on('connection', s => {
  console.log('socket.io connection');
  for (var t = 0; t < 3; t++)
    setTimeout(() => s.emit('message', 'message from server'), 1000*t);
});

app.use((req,res,next) => {
  res.end(`404: ${req.url} not found\n`);
});

var server = http.createServer(app).listen(80);
console.log(`server created on port ${server.address().port}`);