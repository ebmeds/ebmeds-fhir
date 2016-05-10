var xml2js = require('xml2js');
var Patient = require('../domain/ebmeds/Patient');
var System = require('../domain/ebmeds/System');

var service = {

    transform: function(fhirData, context) {

        var request = {
            "DSSRequest": {
                "Patient": Patient.create(fhirData.patient, fhirData.observations, fhirData.conditions),
                "System": System.create(fhirData.activityInstance, fhirData.user, context.language, context.nation)
            }
        };

        return new xml2js.Builder().buildObject(request);
    }
};

module.exports =  service.transform;