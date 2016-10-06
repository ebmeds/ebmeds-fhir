var jp = require('jsonpath');

var service = {

    transform: function(fhirRequest, context) {

        context.parameters = {
            activityInstance: service._getParameter(fhirRequest, "activityInstance", "valueString"),
            user: service._getParameter(fhirRequest, "user", "valueString"),
            context: service._getParameter(fhirRequest, "context", "resource"),
            patient: service._getParameter(fhirRequest, "patient", "valueId"),
            fhirServer: service._getParameter(fhirRequest, "fhirServer", "valueUri")
        };

        return fhirRequest;
    },

    _getParameter: function(fhirRequest, name, property) {
        var params = jp.query(fhirRequest, '$..parameter[?(@.name=="' + name + '")]');
        return params.length === 0 ? null : params[0][property];
    }
};

module.exports =  service.transform;