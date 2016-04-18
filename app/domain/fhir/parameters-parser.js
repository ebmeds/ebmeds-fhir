var jp = require('jsonpath');

var parser = {

    parse: function(request) {
        return {
            activityInstance: parser._getParameter(request, "activityInstance", "valueString"),
            context: parser._getParameter(request, "context", "resource"),
            patient: parser._getParameter(request, "patient", "valueId"),
            fhirServer: parser._getParameter(request, "fhirServer", "valueUri")
        };
    },

    _getParameter: function(request, name, property) {
        var params = jp.query(request, '$..parameter[?(@.name=="' + name + '")]');
        return params.length === 0 ? null : params[0][property];
    }
};

module.exports =  parser;