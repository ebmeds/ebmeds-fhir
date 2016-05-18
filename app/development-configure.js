var http = require('http');
var config = require('config');
var OperationOutcome = require('./domain/fhir/OperationOutcome');

module.exports = function(app) {

    app.use(function(err, req, res, next) {
        res.status(500).json(OperationOutcome.create([{ severity: "fatal", code: "exception", diagnostics: err.stack || err }]));
    });

    var server = config.get('server');

    http.createServer(app).listen(server.port, function() {
        console.log('Express server listening on port ' + server.port);
    });
};