var OperationOutcome = {
    
    create: function(issues) {

        var operationOutcome = {
            "resourceType" : "OperationOutcome",
            "issue" : issues
        };

        return operationOutcome;
    }
};

module.exports = OperationOutcome;