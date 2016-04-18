var Measurement = require('./Measurement');

var Patient = {
    
    create: function(patient, observations) {

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
                "Smoking": {
                    "SmokingStatus": "-1"
                },
                "Pregnancy": {
                    "Pregnant": "0"
                },
                "Lactation": {
                    "Lactating": "0"
                }
            },
            "Problems": {
                "Diagnoses": {
                    "Diagnosis": {
                        "CodeValue": "E10",
                        "CodeSystem": "1.2.246.537.6.1",
                        "CodeSystemVersion": {},
                        "StartStamp": {
                            "StartDate": "2016-04-05"
                        },
                        "DiagnosisName": "Diabetes 1 tyyppi"
                    }
                }
            }
        };
    }
};

module.exports = Patient;