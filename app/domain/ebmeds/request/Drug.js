var moment = require('moment');

var Drug = {
    
    create: function(codeValue, codeSystem, strenght, strenghtUnit,
                     administrationRouteValue, administrationRouteSystem,
                     drugStatus, drugName, startStamp, endStamp) {

        var startDate = startStamp ? moment(startStamp) : null;
        var endDate = endStamp ? moment(endStamp) : null;

        return {
            "CodeValue": codeValue,
            "CodeSystem": codeSystem,
            "StartStamp": {
                "StartDate": startDate ? startDate.format("YYYY-MM-DD") : null,
                "StartTime": startDate ? startDate.format("HH:mm:ss") : null
            },
            "EndStamp": {
                "EndDate": endDate ? endDate.format("YYYY-MM-DD") : null,
                "EndTime": endDate ? endDate.format("HH:mm:ss") : null
            },
            "Strenght": strenght,
            "StrenghtUnit": strenghtUnit,
            "AdministrationRoute": {
                "CodeValue": administrationRouteValue,
                "CodeSystem": administrationRouteSystem
            },
            "DailyDose": "",
            "Dosage": "",
            "DrugStatus": drugStatus,
            "DrugName": drugName
        };
    },

    mapMedicationOrders: function(medicationOrders, drugs) {

        medicationOrders.forEach(function(medicationOrder) {

            if (medicationOrder.medicationCodeableConcept.coding) {

                drugs.push(Drug.create(
                    medicationOrder.medicationCodeableConcept.coding[0].code,
                    medicationOrder.medicationCodeableConcept.coding[0].system,
                    medicationOrder.dosageInstruction[0].doseQuantity ? medicationOrder.dosageInstruction[0].doseQuantity.value : null,
                    medicationOrder.dosageInstruction[0].doseQuantity ? medicationOrder.dosageInstruction[0].doseQuantity.unit : null,
                    medicationOrder.dosageInstruction[0].route.coding[0].code,
                    medicationOrder.dosageInstruction[0].route.coding[0].system,
                    // 0 = On demand 1 = Continuous use
                    (medicationOrder.dosageInstruction.asNeededBoolean || medicationOrder.dosageInstruction.asNeededCodeableConcept) ? "0" : "1",
                    medicationOrder.medicationCodeableConcept.coding[0].display ?
                        medicationOrder.medicationCodeableConcept.coding[0].display : medicationOrder.medicationCodeableConcept.text,
                    medicationOrder.dateWritten,
                    medicationOrder.dateEnded
                ));
            }
        });

        return drugs;
    }
};

module.exports = Drug;