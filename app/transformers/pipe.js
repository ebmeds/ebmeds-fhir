var PromisePipe = require('promise-pipe')();
var transformFhirRequest = require('./fhir-request-to-fhir-data');
var transformFhirData = require('./fhir-data-to-ebmeds-request');
var transformEbmedsRequest = require('./ebmeds-request-to-ebmeds-response');
var transformEbmedsResponse = require('./ebmeds-response-to-fhir-response');

exports.execute = function(req, res, next, context) {

    var pipe = new PromisePipe()
        .then(transformFhirRequest.toFhirData)
        .then(transformFhirData.toEbmedsRequest)
        .then(transformEbmedsRequest.toEbmedsResponse)
        .then(transformEbmedsResponse.toFhirResponse)
        .catch(function(error) {
            next(error);
        });

    pipe(req.body, context).then(function(fhirResponse) {
        res.json(fhirResponse);
    });
};