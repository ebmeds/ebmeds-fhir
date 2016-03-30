var expect = require("chai").expect;
var service = require("../../app/services/hello");

describe("Hello Service", function() {
    it("says hello", function() {
        expect(service.msg()).to.equal("Hello, World!");
    });
});