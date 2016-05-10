var PromisePipe = require('promise-pipe')();
var fhirRequest2FhirData = require('./fhir-request-to-fhir-data');
var fhirData2EbmedsRequest = require('./fhir-data-to-ebmeds-request');
var ebmedsRequest2EbmedsResponse = require('./ebmeds-request-to-ebmeds-response');
var ebmedsResponse2FhirResponse = require('./ebmeds-response-to-fhir-response');

exports.execute = function(req, res, next, context) {

    var pipe = new PromisePipe()
        .then(fhirRequest2FhirData)
        .then(fhirData2EbmedsRequest)
        .then(ebmedsRequest2EbmedsResponse)
        .then(ebmedsResponse2FhirResponse)
        .catch(function(error) {
            next(error);
        });

    pipe(req.body, context).then(function(fhirResponse) {
        res.json(fhirResponse);
    });
};