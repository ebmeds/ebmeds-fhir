var express = require('express');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(cors());
app.use(bodyParser.json({ type: 'application/*', limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./controllers'));

process.env.NODE_ENV === "production" ?
    require('./production-configure')(app) :
    require('./development-configure')(app); // jshint ignore:line
