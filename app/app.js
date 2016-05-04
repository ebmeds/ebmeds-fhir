var express = require('express');
var routes = require('./routes');
var api = require('./routes/api');
var http = require('http');
var config = require('config');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();

app.set('port', config.get('server.port'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(cors());
app.use(bodyParser.json({ type: 'application/*' }));
app.use(express.static(path.join(__dirname, 'public')));

process.env.NODE_ENV === "production" ?
    require('./production-configure')(app) :
    require('./development-configure')(app); // jshint ignore:line

app.get('/', routes.index);
app.post('/api/health-coaching', api.healthCoaching);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
