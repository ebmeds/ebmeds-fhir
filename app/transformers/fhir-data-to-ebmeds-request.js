var xml2js = require('xml2js');
var Patient = require('../domain/ebmeds/Patient');
var ebmedsRequestTemplate = require('./ebmeds-request-template.json');

var service = {

    toEbmedsRequest: function(fhirData) {

        ebmedsRequestTemplate.DSSRequest.Patient = Patient.create(fhirData.patient, fhirData.observations);
        ebmedsRequestTemplate.DSSRequest.System.Application.QueryID = fhirData.activityInstance;

        return new xml2js.Builder().buildObject(ebmedsRequestTemplate);
    }
};

module.exports =  service;