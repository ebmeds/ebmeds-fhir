var expect = require("chai").expect;
var Measurement = require("../../app/domain/ebmeds/Measurement");

describe("Measurement", function() {

    it("create succeeds", function() {
        var expected = require("./ebmeds-measurement.json");
        var actual = Measurement.create("code", "2016-02-19T07:30:00+03:00", "value", "unit", "name");
        expect(JSON.stringify(expected)).to.equal(JSON.stringify(actual));
    });

    it("mapObservation succeeds", function() {
        var expected = Measurement.create("code", "2016-02-19T07:30:00+03:00", "value", "unit", "name");
        var actual = Measurement.mapObservation(require("./fhir-observation.json").resource);
        expect(JSON.stringify(expected)).to.equal(JSON.stringify(actual));
    });
});