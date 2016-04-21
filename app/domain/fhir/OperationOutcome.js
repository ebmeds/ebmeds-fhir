var OperationOutcome = {
    
    create: function(severity, code, diagnostics) {

        var operationOutcome = {
            "resourceType" : "OperationOutcome",
            "issue" : [{
                "severity" : severity,
                "code" : code,
                "diagnostics" : diagnostics
            }]
        };

        return operationOutcome;
    }
};

module.exports = OperationOutcome;