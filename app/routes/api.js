var xml2js = require('xml2js');
var jp = require('jsonpath');
var parametersParser = require('../domain/fhir/parameters-parser');
var fhirService = require('../domain/fhir-service');
var ebmedsClient = require('../client/ebmeds-client.js');
var ebmedsRequestTemplate = require('../client/request-template.json');
var fhirResponseTemplate = require('../client/response-template.json');
var requestMockIncoming = require('../client/request-mock-incoming-without-context.json');
var Patient = require('../domain/ebmeds/Patient');
var Measurement = require('../domain/ebmeds/Measurement');
var config = require('config');
// Variable to find Finrisk -link from Experimental dataset
var FinriskLink = config.get('finrisk.url');
var q = require('q');

exports.healthCoaching = function(req, res, next) {

    var parameters = parametersParser.parse(requestMockIncoming);

    q.all([fhirService.getPatient(parameters), fhirService.getObservations(parameters)]).spread(function(patient, observations) {

        ebmedsRequestTemplate.DSSRequest.Patient = Patient.create(patient, observations);
        ebmedsRequestTemplate.DSSRequest.System.Application.QueryID = parameters.activityInstance;

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
                fhirResponseTemplate.parameter[0].part[4].part[1].valueUri = resFinriskLink;

                res.json(fhirResponseTemplate);
            });
        });
    }).catch(function(error) {
        next(error);
    });
};