var _ = require('lodash');
var moment = require('moment');

var blacklistedCodes = ["108252007"];

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

    loincOrFirst: function(coding) {
        var loinc = _.find(coding, { system: "http://loinc.org" });
        return loinc ? loinc : coding[0];
    },

    whitelistedCodes: function(coding) {
        var whitelistedCodes = _.filter(coding, function(code) {
            return !_.includes(blacklistedCodes, code.code);
        });
        return whitelistedCodes.length > 0 ? whitelistedCodes : coding; // fallback
    },

    mapObservation: function(observation, parent) {

        var code = Measurement.loincOrFirst(Measurement.whitelistedCodes(observation.code.coding));

        return Measurement.create(
            code.code,
            code.system,
            observation.effectiveDateTime ? observation.effectiveDateTime : parent ? parent.effectiveDateTime : null,
            observation.valueQuantity ? observation.valueQuantity.value : observation.valueString ? observation.valueString : null,
            observation.valueQuantity ? observation.valueQuantity.unit : null,
            observation.code.text ? observation.code.text : code.display);
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