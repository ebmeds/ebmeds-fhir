var expect = require("chai").expect;
var Measurement = require("../../../app/domain/ebmeds/request/Measurement");

describe("Measurement", function() {

    it("create succeeds with date and time", function() {

        var actual = Measurement.create("code", "2016-06-19T07:30:00+03:00", "value", "unit", "name");

        expect("code").to.equal(actual.CodeValue);
        expect("2016-06-19").to.equal(actual.PointStamp.PointDate);
        expect("07:30:00").to.equal(actual.PointStamp.PointTime);
        expect("value").to.equal(actual.Result.Value);
        expect("unit").to.equal(actual.Result.Unit);
        expect("name").to.equal(actual.MeasurementName);
    });

    it("create succeeds with date only", function() {

        var actual = Measurement.create("code", "2016-06-19", "value", "unit", "name");

        expect("2016-06-19").to.equal(actual.PointStamp.PointDate);
        expect("00:00:00").to.equal(actual.PointStamp.PointTime);
    });

    it("mapObservation succeeds", function() {

        var observation = {
            "fullUrl": "http://fhirsandbox.kanta.fi/kanta-phr-sandbox/baseDstu2/Observation/767",
            "resource": {
                "resourceType": "Observation",
                "id": "767",
                "code": {
                    "coding": [
                        {
                            "system": "http://loinc.org",
                            "code": "code",
                            "display": "name"
                        }
                    ]
                },
                "subject": {
                    "reference": "Patient/example"
                },
                "valueQuantity": {
                    "value": "value",
                    "unit": "unit",
                    "system": "http://unitsofmeasure.org"
                },
                "effectiveDateTime": "2016-06-19T07:30:00+03:00"
            }
        };

        var expected = Measurement.create("code", "2016-06-19T07:30:00+03:00", "value", "unit", "name");
        var actual = Measurement.mapObservation(observation.resource);

        expect(JSON.stringify(expected)).to.equal(JSON.stringify(actual));
    });
});