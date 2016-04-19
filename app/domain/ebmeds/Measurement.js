var Measurement = {
    
    create: function(code, date, value, unit, name) {

        var parsedDate = date.split("T");

        return {
            "CodeValue": code,
            "CodeSystem": "2.16.840.1.113883.6.1",
            "PointStamp": {
                "PointDate": parsedDate[0],
                "PointTime": parsedDate.length > 1 ? parsedDate[1] : null
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
            observation.effectiveDateTime ? observation.effectiveDateTime : parent ? parent.effectiveDateTime : null,
            observation.valueQuantity.value,
            observation.valueQuantity.unit,
            observation.code.coding[0].display);
    },

    mapObservations: function(observations, measurements, parent) {

        observations.forEach(function(observation) {
            
            // Process child observations if exist
            if (observation.component) {
                Measurement.mapObservations(observation.component, measurements, observation);
            }
            // Require code and quantity information for single observation, otherwise skip
            if (observation.code && observation.code.coding && observation.valueQuantity) {
                measurements.push(Measurement.mapObservation(observation, parent));
            }
        });

        return measurements;
    }
};

module.exports = Measurement;