var http = require('http');
var config = require('config');
var OperationOutcome = require('./domain/fhir/OperationOutcome');

module.exports = function(app) {

    app.use(require('./middleware/error-response')({ stacktrace: true }));

    var server = config.get('server');

    http.createServer(app).listen(server.port, function() {
        console.log('Express server listening on port ' + server.port);
    });
};