var http = require('http');
var express = require('express');
var bodyParser = require('body-parser')
var ejs = require('ejs');

var app = express();

app.set('view engine', 'ejs');
app.engine("html", ejs.renderFile);
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/static/'));

app.get('/', (req, res) => {
    var model = {};
    res.render('index.html', model);
});

app.use((req,res,next) => {
  res.end(`404: ${req.url} not found\n`);
});

var server = http.createServer(app).listen(3666);
console.log(`server created on port ${server.address().port}`);