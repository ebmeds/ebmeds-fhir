var xml2js = require('xml2js');
var jp = require('jsonpath');
var ebmedsClient = require('../client/ebmeds.js');
var ebmedsRequestTemplate = require('../client/request-template.json');
var FHIRResponseTemplate = require('../client/response-template.json');
var requestMockIncoming = require('../client/request-mock-incoming.json');
var Patient = require('../domain/Patient');
var Measurement = require('../domain/Measurement');
var config = require('config');
// Variable to find Finrisk -link from Experimental dataset
var FinriskLink= config.get('finrisk.url');
var resultFHIR = {};

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
            //Parsing result from EBMeDS engine, finding Finrisk Link from JSON Response
            var resFormAssistantLinks = jp.query(result, '$..ExperimentalDataSet[?(@.DataSetName=="FormAssistantLinks")]')[0];
            var resDataSetText = jp.query(resFormAssistantLinks, '$..DataSetText')[0];
            //Getting just the link to Finrisk from the DataSetText
            var resFinriskLink = JSON.stringify(resDataSetText);
            resFinriskLink = resFinriskLink.split(FinriskLink).pop();
            resFinriskLink = resFinriskLink.split("'")[0];
            resFinriskLink = FinriskLink+resFinriskLink;
            //Generating FHIR JSON response
            resultFHIR = FHIRResponseTemplate;
            resultFHIR.parameter[0].part[4].part[1].valueUri=resFinriskLink;
            res.json(resultFHIR);
        });
    });
};