var fhirClient = require('fhir.js');
var jp = require('jsonpath');
var Bluebird = require('bluebird');

var service = {

    transform: function(fhirRequest, context) {

        // FIXME Optimize resource queries
        return Bluebird.all([
            service._getPatient(context.parameters),
            service._getResources("Observation", context.parameters, { patient: context.parameters.patient }),
            service._getResources("Condition", context.parameters, { patient: context.parameters.patient }),
            service._getResources("MedicationOrder", context.parameters, { patient: context.parameters.patient, status: "active" })])
            .spread(function(patient, observations, conditions, medicationOrders) {
            return {
                activityInstance: context.parameters.activityInstance,
                user: context.parameters.user,
                patient: patient,
                observations: observations,
                conditions: conditions,
                medicationOrders: medicationOrders
            };
        });
    },

    _getPatient: function(parameters) {

        if (parameters.context) {

            return new Bluebird(function(resolve, reject) {
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

    _getResources: function(resourceType, parameters, queryParameters) {

        if (parameters.context) {

            return new Promise(function(resolve, reject) {
                resolve(jp.query(parameters.context, '$..entry[?(@.resource.resourceType=="' + resourceType + '")].resource'));
            });

        } else if (parameters.patient && parameters.fhirServer) {

            var client = fhirClient({ baseUrl: parameters.fhirServer });

            return client.search({ type: resourceType, query: queryParameters }).then(function(response) {
                return jp.query(response.data, '$..entry[*].resource');
            });
        }

        throw new Error("Parameters missing context and patient/fhirServer");
    }
};

module.exports =  service.transform;