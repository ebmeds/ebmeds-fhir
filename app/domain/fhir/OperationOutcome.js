var OperationOutcome = {
    
    create: function(issues) {
        return {
            "resourceType" : "OperationOutcome",
            "issue" : issues
        };
    }
};

module.exports = OperationOutcome;