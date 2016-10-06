var SmokingStatus = {

    parse: function(observations) {

        return {
            "SmokingStatus": SmokingStatus._parseSmokingStatus(observations) || -1  // -1 not known
        };
    },

    _parseSmokingStatus: function(observations) {

        var smokingStatus = null;

        observations.forEach(function(observation) {

            if (observation.contained) {
                smokingStatus = SmokingStatus._parseSmokingStatus(observation.contained);
            } else {
                switch (observation.valueString) {
                    // Cerner string values
                    case "Never smoker": smokingStatus = 0; break;                      // non-smoker
                    case "Current every day smoker": smokingStatus = 1; break;          // smoker
                    case "Current some day smoker": smokingStatus = 1; break;           // smoker
                    case "Smoker, current status unknown": smokingStatus = 1; break;    // smoker
                    case "Heavy tobacco smoker": smokingStatus = 1; break;              // smoker
                    case "Light tobacco smoker": smokingStatus = 1; break;              // smoker
                    case "Former smoker": smokingStatus = 2; break;                     // former smoker
                    case "Unknown if ever smoked": smokingStatus = -1; break;           // not known
                }
            }
        });

        return smokingStatus;
    }
};

module.exports = SmokingStatus;