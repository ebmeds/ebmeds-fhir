var PromisePipe = require('promise-pipe')();
var transformFhirRequest = require('../transformers/fhir-request-to-fhir-data');
var transformFhirData = require('../transformers/fhir-data-to-ebmeds-request');
var transformEbmedsRequest = require('../transformers/ebmeds-request-to-ebmeds-response');
var transformEbmedsResponse = require('../transformers/ebmeds-response-to-fhir-response');

exports.healthCoaching = function(req, res, next) {

    var pipe = new PromisePipe()
        .then(transformFhirRequest.toFhirData)
        .then(transformFhirData.toEbmedsRequest)
        .then(transformEbmedsRequest.toEbmedsResponse)
        .then(transformEbmedsResponse.toFhirResponse)
        .catch(function(error) {
            next(error);
        });

    pipe(req.body).then(function(fhirResponse) {
        res.json(fhirResponse);
    });
};