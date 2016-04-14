var xml2js = require('xml2js');
var jp = require('jsonpath');
var ebmedsClient = require('../client/ebmeds.js');
var ebmedsRequestTemplate = require('../client/request-template.json');
var requestMockIncoming = require('../client/request-mock-incoming.json');
var Patient = require('../domain/Patient');
var Measurement = require('../domain/Measurement');

exports.healthCoaching = function(req, res) {

    var bundle = jp.query(requestMockIncoming, '$..parameter[?(@.name=="context")]')[0];
    var patient =  jp.query(bundle, '$..resource.entry[?(@.resource.resourceType=="Patient")].resource')[0];
    var activityInstance = jp.query(requestMockIncoming, '$..parameter[?(@.name=="activityInstance")]')[0];
    var observations =  jp.query(bundle, '$..resource.entry[?(@.resource.resourceType=="Observation")].resource');

    ebmedsRequestTemplate.DSSRequest.Patient = Patient.create(patient, observations);
    ebmedsRequestTemplate.DSSRequest.System.Application.QueryID = activityInstance.valueString;

    var ebmedsRequest = new xml2js.Builder().buildObject(ebmedsRequestTemplate);
    
    ebmedsClient.request(ebmedsRequest).then(function(response) {
        xml2js.parseString(response, function(err, result) {
            res.json(result);
        });
    });
};