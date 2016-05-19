var express = require('express');
var config = require('config');
var cors = require('cors');
var path = require('path');
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

app.listen(config.get('server.port'), function() {
    console.log('Express server listening on port ' + config.get('server.port'));
});
