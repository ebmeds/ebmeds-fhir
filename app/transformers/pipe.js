var PromisePipe = require('promise-pipe')();
var fhirRequestParams2ContextParams = require('./request/fhir-request-params-to-context-params');
var fhirRequest2FhirData = require('./request/fhir-request-to-fhir-data');
var fhirData2EbmedsRequest = require('./request/fhir-data-to-ebmeds-request');
var ebmedsRequest2EbmedsResponse = require('./response/ebmeds-request-to-ebmeds-response');
var ebmedsResponse2FhirResponse = require('./response/ebmeds-response-to-fhir-response');

exports.execute = function(req, res, next, context) {

    var pipe = new PromisePipe()
        .then(fhirRequestParams2ContextParams)
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