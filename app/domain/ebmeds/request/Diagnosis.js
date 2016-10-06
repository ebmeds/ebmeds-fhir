var Diagnosis = {
    
    create: function(codeValue, codeSystem, startDate, name) {

        return {
            "CodeValue": codeValue,
            "CodeSystem": codeSystem,
            "CodeSystemVersion": {},
            "StartStamp": {
                "StartDate": startDate
            },
            "DiagnosisName": name
        };
    },

    mapCondition: function(condition) {
        return Diagnosis.create(
            condition.code.coding[0].code,
            // FIXME System mappings?
            "2.16.840.1.113883.6.2",
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