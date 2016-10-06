var fhirClient = require('fhir.js');
var jp = require('jsonpath');
var Promise = require('bluebird');

var service = {

    transform: function(fhirRequest, context) {
        
        return Promise.all([
            service._getPatient(context.parameters),
            service._getResources("Observation", context.parameters),
            service._getResources("Condition", context.parameters)])
            .spread(function(patient, observations, conditions) {
            return {
                activityInstance: context.parameters.activityInstance,
                user: context.parameters.user,
                patient: patient,
                observations: observations,
                conditions: conditions
            };
        });
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

    _getResources: function(resourceType, parameters) {

        if (parameters.context) {

            return new Promise(function(resolve, reject) {
                resolve(jp.query(parameters.context, '$..entry[?(@.resource.resourceType=="' + resourceType + '")].resource'));
            });

        } else if (parameters.patient && parameters.fhirServer) {

            var client = fhirClient({ baseUrl: parameters.fhirServer });

            return client.search({ type: resourceType, query: { patient: parameters.patient } }).then(function(response) {
                return jp.query(response.data, '$..entry[*].resource');
            });
        }

        throw new Error("Parameters missing context and patient/fhirServer");
    }
};

module.exports =  service.transform;