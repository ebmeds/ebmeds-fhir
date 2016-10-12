var Diagnosis = {
    
    create: function(codeValue, codeSystem, startDate, name) {

        return {
            "CodeValue": codeValue,
            "CodeSystem": codeSystem,
            "StartStamp": {
                "StartDate": startDate
            },
            "DiagnosisName": name
        };
    },

    mapCondition: function(condition) {
        return Diagnosis.create(
            condition.code.coding[0].code,
            condition.code.coding[0].system,
            condition.dateRecorded,
            condition.code.coding[0].display);
    },

    mapConditions: function(conditions, diagnostics) {

        conditions.forEach(function(condition) {
            if (condition.code && condition.code.coding) {
                diagnostics.push(Diagnosis.mapCondition(condition));
            }
        });

        return diagnostics;
    }
};

module.exports = Diagnosis;