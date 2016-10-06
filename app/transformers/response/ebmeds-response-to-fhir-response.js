var jp = require('jsonpath');

var OperationOutcome = require('../../domain/fhir/OperationOutcome');
var Parameters = require('../../domain/fhir/Parameters');

var Reminder = require('../../domain/ebmeds/response/Reminder');
var GuidelineLink = require('../../domain/ebmeds/response/GuidelineLink');
var FinriskLink = require('../../domain/ebmeds/response/FinriskLink');

var service = {

    transform: function(ebmedsResponse, context) {

        if (context.requestParams.debug) {

            var exceptions = jp.query(ebmedsResponse, '$..Exceptions[*].Exception[*]');

            if (exceptions.length > 0) {
                return OperationOutcome.create(exceptions.map(function(exception) {
                    return {
                        severity: "error",
                        code: "exception",
                        diagnostics: exception
                    };
                }));
            }
        }

        return service._createResponse(ebmedsResponse, context);
    },

    _createResponse: function(ebmedsResponse, context) {

        var reminders = jp.query(ebmedsResponse, '$..Reminders[*].Reminder[*]');
        var links = jp.query(ebmedsResponse, '$..GuidelineLinks[*].GuidelineLink[*]');
        var finriskDataset = jp.query(ebmedsResponse, '$..ExperimentalDataSet[?(@.DataSetName=="calculatorFinrisk")]')[0];

        var cards = [];

        if (context.cards.indexOf("reminders") > -1) { cards.push(Reminder.toCards(reminders, context)); }
        if (context.cards.indexOf("guidelink") > -1 && links.length > 0) { cards.push(GuidelineLink.toCard(links)); }
        if (context.cards.indexOf("finrisklink") > -1 && finriskDataset) { cards.push(FinriskLink.toCard(finriskDataset)); }

        return Parameters.create(cards);
    }
};

module.exports = service.transform;