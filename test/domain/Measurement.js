var expect = require("chai").expect;
var Measurement = require("../../app/domain/Measurement");

describe("Measurement", function() {

    it("create succeeds", function() {
        var expected = require("./ebmeds-measurement.json");
        var actual = Measurement.create("code", "date", "value", "unit", "name");
        expect(JSON.stringify(expected)).to.equal(JSON.stringify(actual));
    });

    it("mapObservation succeeds", function() {
        var expected = Measurement.create("code", "date", "value", "unit", "name");
        var actual = Measurement.mapObservation(require("./fhir-observation.json").resource);
        expect(JSON.stringify(expected)).to.equal(JSON.stringify(actual));
    });
});