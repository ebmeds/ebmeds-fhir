var OperationOutcome = require('../domain/fhir/OperationOutcome');

module.exports = function(options) {
    return function(err, req, res, next) {
        res.status(500).json(OperationOutcome.create([{
            severity: "fatal",
            code: "exception",
            diagnostics: options.stacktrace ? err.stack || err : err.message || err
        }]));
    };
};