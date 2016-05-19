var fs = require('fs');
var https = require('https');
var winston = require('winston');
var config = require('config');
var OperationOutcome = require('./domain/fhir/OperationOutcome');

module.exports = function(app) {

    app.use(require('./middleware/error-logger')({ transports: [
        new winston.transports.File({
            name: "errorFileLog",
            filename: "error.log",
            level: 'error',
            humanReadableUnhandledException: true,
            handleExceptions: true,
            json: false
        })
    ]}));

    app.use(require('./middleware/error-response')({ stacktrace: false }));

    var server = config.get('server');

    https.createServer({
        key: fs.readFileSync(server.key),
        cert: fs.readFileSync(server.cert)
    }, app).listen(server.port, function() {
        console.log('Express server listening on port ' + server.port);
    });
};