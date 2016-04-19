var express = require('express')
  , routes = require('./routes')
  , api = require('./routes/api')
  , http = require('http')
  , config = require('config')
  , path = require('path');

var app = express();

app.set('port', config.get('server.port'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('production' ===  process.env.NODE_ENV) {
    app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.status(500).send(err.message ? err.message : "Unknown error occurred");
    });
}

app.get('/', routes.index);
app.get('/api/health-coaching', api.healthCoaching);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
