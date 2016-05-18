var fs = require('fs');
var https = require('https');
var config = require('config');
var winston = require('winston');
var OperationOutcome = require('./domain/fhir/OperationOutcome');

module.exports = function(app) {

    var logger = new winston.Logger({
        transports: [
            new winston.transports.File({
                name: "errorLogFile",
                filename: 'error.log',
                level: 'error',
                humanReadableUnhandledException: true,
                handleExceptions: true,
                json: false
            })
        ]
    });

    app.use(function(err, req, res, next) {
        logger.error(err);
        res.status(500).json(OperationOutcome.create([{ severity: "fatal", code: "exception", diagnostics: err.message }]));
    });

    var server = config.get('server');

    https.createServer({
        key: fs.readFileSync(server.key),
        cert: fs.readFileSync(server.cert)
    }, app).listen(server.port, function() {
        console.log('Express server listening on port ' + server.port);
    });
};