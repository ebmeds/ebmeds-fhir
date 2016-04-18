var mkFhir = require('fhir.js');
var jp = require('jsonpath');
var q = require('q');

var service = {

    getPatient: function(parameters) {

        if (parameters.context) {

            var deferred = q.defer();
            deferred.resolve(jp.query(parameters.context, '$..entry[?(@.resource.resourceType=="Patient")].resource')[0]);
            return deferred.promise;

        } else if (parameters.patient && parameters.fhirServer) {

            var client = mkFhir({ baseUrl: parameters.fhirServer });

            return client.read({ type: "Patient", patient: parameters.patient }).then(function(response) {
                return response.data;
            });
        }

        throw new Error("Parameters missing context and patient/fhirServer");
    },

    getObservations: function(parameters) {

        if (parameters.context) {

            var deferred = q.defer();
            deferred.resolve(jp.query(parameters.context, '$..entry[?(@.resource.resourceType=="Observation")].resource'));
            return deferred.promise;

        } else if (parameters.patient && parameters.fhirServer) {

            var client = mkFhir({ baseUrl: parameters.fhirServer });

            return client.search({ type: "Observation", query: { patient: parameters.patient } }).then(function(response) {
                return jp.query(response.data, '$..entry[*].resource');
            });
        }

        throw new Error("Parameters missing context and patient/fhirServer");
    }
};

module.exports =  service;