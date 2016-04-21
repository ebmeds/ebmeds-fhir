var OperationOutcome = require('./domain/fhir/OperationOutcome');

module.exports = function(app) {

    app.use(function(err, req, res, next) {
        res.status(500).json(OperationOutcome.create("fatal", err.message, err.stack));
    });
};