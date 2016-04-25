var expect = require("chai").expect;
var Patient = require("../../../app/domain/ebmeds/Patient");

describe("Patient", function() {

    it("create succeeds", function() {

        var expected = {
            "resourceType": "Patient",
            "id": "example",
            "gender": "male",
            "birthDate": "1970-09-31"
        };

        var actual = Patient.create(expected, [], []);

        expect("example").to.equal(actual.PatientID);
        expect("1970").to.equal(actual.Properties.BirthTimeStamp.Year);
        expect("09").to.equal(actual.Properties.BirthTimeStamp.Month);
        expect("31").to.equal(actual.Properties.BirthTimeStamp.Day);
        expect("M").to.equal(actual.Properties.Gender);

        expect(0).to.equal(actual.Investigations.Measurements.Measurement.length);
    });
});