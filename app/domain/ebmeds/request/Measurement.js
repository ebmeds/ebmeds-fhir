var moment = require('moment');

var Measurement = {
    
    create: function(code, system, date, value, unit, name) {

        var parsedDate = moment(date);

        return {
            "CodeValue": code,
            "CodeSystem": system,
            "PointStamp": {
                "PointDate": parsedDate.format("YYYY-MM-DD"),
                "PointTime": parsedDate.format("HH:mm:ss")
            },
            "Result": {
                "Value": value,
                "Unit": unit
            },
            "MeasurementName": name
        };
    },

    mapObservation: function(observation, parent) {
        return Measurement.create(
            observation.code.coding[0].code,
            observation.code.coding[0].system,
            observation.effectiveDateTime ? observation.effectiveDateTime : parent ? parent.effectiveDateTime : null,
            observation.valueQuantity ? observation.valueQuantity.value : observation.valueString ? observation.valueString : null,
            observation.valueQuantity ? observation.valueQuantity.unit : null,
            observation.code.coding[0].display);
    },

    mapObservations: function(observations, measurements, parent) {

        observations.forEach(function(observation) {
            
            // Process child observations if exist
            if (observation.component) {
                Measurement.mapObservations(observation.component, measurements, observation);
            }

            if (observation.code && observation.code.coding) {
                measurements.push(Measurement.mapObservation(observation, parent));
            }
        });

        return measurements;
    }
};

module.exports = Measurement;