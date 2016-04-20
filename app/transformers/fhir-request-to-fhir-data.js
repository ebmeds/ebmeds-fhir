var fhirClient = require('fhir.js');
var jp = require('jsonpath');
var Promise = require('bluebird');

var service = {

    toFhirData: function(fhirRequest) {

        var parameters = service._getParameters(fhirRequest);

        return Promise.all([service._getPatient(parameters), service._getObservations(parameters)]).spread(function(patient, observations) {
            return {
                activityInstance: parameters.activityInstance,
                patient: patient,
                observations: observations
            };
        });
    },

    _getParameters: function(fhirRequest) {
        return {
            activityInstance: service._getParameter(fhirRequest, "activityInstance", "valueString"),
            context: service._getParameter(fhirRequest, "context", "resource"),
            patient: service._getParameter(fhirRequest, "patient", "valueId"),
            fhirServer: service._getParameter(fhirRequest, "fhirServer", "valueUri")
        };
    },

    _getParameter: function(fhirRequest, name, property) {
        var params = jp.query(fhirRequest, '$..parameter[?(@.name=="' + name + '")]');
        return params.length === 0 ? null : params[0][property];
    },

    _getPatient: function(parameters) {

        if (parameters.context) {

            return new Promise(function(resolve, reject) {
                resolve(jp.query(parameters.context, '$..entry[?(@.resource.resourceType=="Patient")].resource')[0]);
            });

        } else if (parameters.patient && parameters.fhirServer) {

            var client = fhirClient({ baseUrl: parameters.fhirServer });

            return client.read({ type: "Patient", patient: parameters.patient }).then(function(response) {
                return response.data;
            });
        }

        throw new Error("Parameters missing context and patient/fhirServer");
    },

    _getObservations: function(parameters) {

        if (parameters.context) {

            return new Promise(function(resolve, reject) {
                resolve(jp.query(parameters.context, '$..entry[?(@.resource.resourceType=="Observation")].resource'));
            });

        } else if (parameters.patient && parameters.fhirServer) {

            var client = fhirClient({ baseUrl: parameters.fhirServer });

            return client.search({ type: "Observation", query: { patient: parameters.patient } }).then(function(response) {
                return jp.query(response.data, '$..entry[*].resource');
            });
        }

        throw new Error("Parameters missing context and patient/fhirServer");
    }
};

module.exports =  service;