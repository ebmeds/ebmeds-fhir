var Measurement = require('./Measurement');
var Diagnosis = require('./Diagnosis');
var SmokingStatus = require('./SmokingStatus');

var Patient = {
    
    create: function(patient, observations, conditions) {

        var birth = patient.birthDate.split("-");

        return {
            "PatientID": patient.id,
            "Properties": {
                "BirthTimeStamp": {
                    "Year": birth[0],
                    "Month": birth[1],
                    "Day": birth[2]
                },
                "Gender": patient.gender === "male" ? "M" : "F"
            },
            "Investigations": {
                "Measurements": {
                    "Measurement": Measurement.mapObservations(observations, [])
                }
            },
            "Risks": {
                "DrugsToAvoid": {},
                "Smoking": SmokingStatus.parse(observations),
                "Pregnancy": {
                    "Pregnant": "0"
                },
                "Lactation": {
                    "Lactating": "0"
                }
            },
            "Problems": {
                "Diagnoses": {
                    "Diagnosis": Diagnosis.mapConditions(conditions, [])
                }
            }
        };
    }
};

module.exports = Patient;