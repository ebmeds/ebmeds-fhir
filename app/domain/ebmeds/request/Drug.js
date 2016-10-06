var Drug = {
    
    create: function(codeValue, codeSystem, strenght, strenghtUnit, administrationRouteValue, administrationRouteSystem,
                     dailyDose, dosage, drugStatus, drugName) {
        return {
            "CodeGroup": {
                "CodeValue": codeValue,
                "CodeSystem": codeSystem
            },
            "TimeStampsGroup": {
                "StartStamp": "",
                "EndStamp": "",
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

    mapMedicationPrescriptions: function(medicationPrescriptions, drugs) {
        medicationPrescriptions.map(function(medicationPrescription) {

            drugs.push(Drug.create(
                medicationPrescription.contained[0].code.text,
                "codeSystem",
                medicationPrescription.dosageInstruction[0].doseQuantity.value,
                medicationPrescription.dosageInstruction[0].doseQuantity.units,
                medicationPrescription.dosageInstruction[0].route.text,
                "administrationRouteSystem",
                "dailyDose",
                "dosage",
                // 0 = On demand 1 = Continuous use
                medicationPrescription.dosageInstruction.asNeededBoolean ? "0" : "1",
                // FIXME Should be medication.name according to specs
                medicationPrescription.medication.display
            ));
        });

        return drugs;
    }
};

module.exports = Drug;