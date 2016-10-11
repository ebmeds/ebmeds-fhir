var Drug = {
    
    create: function(codeValue, codeSystem, strenght, strenghtUnit, administrationRouteValue, administrationRouteSystem,
                     dailyDose, dosage, drugStatus, drugName, startStamp, endStamp) {
        return {
            "CodeGroup": {
                "CodeValue": codeValue,
                "CodeSystem": codeSystem
            },
            "TimeStampsGroup": {
                "StartStamp": startStamp,
                "EndStamp": endStamp,
                "PointStamp": ""
            },
            "Strenght": strenght,
            "StrenghtUnit": strenghtUnit,
            "AdministrationRoute": {
                "CodeValue": administrationRouteValue,
                "CodeSystem": administrationRouteSystem
            },
            "DailyDose": dailyDose,
            "Dosage": dosage,
            "LastPrescription": {
                "TimeStampsGroup": {
                    "StartStamp": "",
                    "EndStamp": "",
                    "PointStamp": ""
                },
                "PackageAmount": ""
            },
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
                    medicationOrder.dosageInstruction[0].doseQuantity.value,
                    medicationOrder.dosageInstruction[0].doseQuantity.unit,
                    medicationOrder.dosageInstruction[0].route.coding[0].code,
                    medicationOrder.dosageInstruction[0].route.coding[0].system,
                    "dailyDose",
                    "dosage",
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