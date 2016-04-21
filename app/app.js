var express = require('express');
var routes = require('./routes');
var api = require('./routes/api');
var http = require('http');
var config = require('config');
var path = require('path');
var app = express();

app.set('port', config.get('server.port'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure('production', function() { require('./production-configure')(app); });
app.configure('development', function() { require('./development-configure')(app); });

app.get('/', routes.index);
app.post('/api/health-coaching', api.healthCoaching);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
