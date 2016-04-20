var expect = require("chai").expect;
var transformer = require("../../app/transformers/fhir-request-to-fhir-data");

describe("Transform FHIR request to FHIR data", function() {

    it("getParameters succeeds", function() {

        var expectedParameters = require("./fhir-request.json");
        var actualParameters = transformer._getParameters(expectedParameters);

        expect("565a1dd3-71b2-4f75-8f55-692fcaaccbf6f").to.equal(actualParameters.activityInstance);
        expect("Patient/example").to.equal(actualParameters.context.patient.reference);
        expect("4154007").to.equal(actualParameters.patient);
        expect("https://fhir-open.sandboxcernerpowerchart.com/dstu2/d075cf8b-3261-481d-97e5-ba6c48d3b41f").to.equal(actualParameters.fhirServer);
    });
});