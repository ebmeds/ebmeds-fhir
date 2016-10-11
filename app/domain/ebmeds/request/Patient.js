var moment = require('moment');
var Measurement = require('./Measurement');
var Diagnosis = require('./Diagnosis');
var Drug = require('./Drug');
var SmokingStatus = require('./SmokingStatus');

var Patient = {
    
    create: function(patient, observations, conditions, medicationOrder) {

        var parsedBirthDate = moment(patient.birthDate);

        return {
            "PatientID": patient.id,
            "Properties": {
                "BirthTimeStamp": {
                    "Year": parsedBirthDate.format("YYYY"),
                    "Month": parsedBirthDate.format("MM"),
                    "Day": parsedBirthDate.format("DD")
                },
                "Gender": patient.gender === "male" ? "M" : "F"
            },
            "Investigations": {
                "Measurements": {
                    "Measurement": Measurement.mapObservations(observations, [])
                }
            },
            "Risks": {
                "Smoking": SmokingStatus.parse(observations)
            },
            "Problems": {
                "Diagnoses": {
                    "Diagnosis": Diagnosis.mapConditions(conditions, [])
                }
            },
            "Interventions": {
                "Medication": {
                    "Drug": Drug.mapMedicationOrders(medicationOrder, [])
                }
            }
        };
    }
};

module.exports = Patient;