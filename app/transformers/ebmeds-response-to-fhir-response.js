var jp = require('jsonpath');
var Card = require('../domain/cds/Card');
var OperationOutcome = require('../domain/fhir/OperationOutcome');
var Parameters = require('../domain/fhir/Parameters');

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

        var cards = [];

        service._addReminders(ebmedsResponse, cards);
        service._addGuideLink(ebmedsResponse, cards);
        service._addFinriskLink(ebmedsResponse, cards);

        return Parameters.create(cards);
    },

    _addReminders: function(ebmedsResponse, cards) {

        var reminders = jp.query(ebmedsResponse, '$..Reminders[*].Reminder[*]');

        reminders.forEach(function(reminder) {
            cards.push(Card.create({
                summary: service._getReminderText(reminder, "ReminderShort"),
                detail: service._getReminderText(reminder, "ReminderLong"),
                sourceLabel: reminder.ScriptID[0],
                sourceUrl: "http://www.ebmeds.org/web/guest/scripts?id=" + reminder.ScriptID[0] + "&lang=fi",
                indicator: service._mapReminderLevel(reminder.ReminderLevel[0]),
                links: []
            }));
        });
    },

    _getReminderText: function(reminder, property) {

        var rm = reminder[property][0];

        // Reminder object text if object, plain text, or fallback
        return rm._ ? rm._ : rm ? rm : reminder.ReminderPatient[0];
    },

    _addGuideLink: function(ebmedsResponse, cards) {

        var links = jp.query(ebmedsResponse, '$..GuidelineLinks[*].GuidelineLink[*]');

        if (links.length > 0) {
            cards.push(Card.create({
                summary: "Hoitosuositukset",
                detail: null,
                sourceLabel: "Lisätietoja",
                sourceUrl: "http://www.terveyskirjasto.fi",
                indicator: "info",
                links: links.map(function(link) {
                    return { label: link.GuidelineTitle[0], url: link.GuidelineURL[0] };
                })
            }));
        }
    },

    _addFinriskLink: function(ebmedsResponse, cards) {

        var finriskDataset = jp.query(ebmedsResponse, '$..ExperimentalDataSet[?(@.DataSetName=="calculatorFinrisk")]')[0];

        if (finriskDataset) {
            cards.push(Card.create({
                summary: "FINRISK calculator",
                detail: "With the FINRISK calculator you can calculate your risk of acute myocardial infarction or acute disorder of the cerebral circulation within the next ten years. The calculator gives your disease risk as a percentage.",
                sourceLabel: "FINRISK calculator - Instructions and interpretation",
                sourceUrl: "https://www.thl.fi/en/web/chronic-diseases/cardiovascular-diseases/finrisk-calculator/instructions",
                indicator: "info",
                links: [{ label: "FINRISK calculator", url: finriskDataset.DataSetText[0] }]
            }));
        }
    },

    _mapReminderLevel: function(reminderLevel) {
        switch (reminderLevel) {
            case "0":
                return "info";
            case "1":
                return "warning";
            case "2":
                return "hard-stop";
            default:
                return "unknown " + "(" + reminderLevel + ")";
        }
    }
};

module.exports = service.transform;