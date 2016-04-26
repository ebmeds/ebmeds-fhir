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
};