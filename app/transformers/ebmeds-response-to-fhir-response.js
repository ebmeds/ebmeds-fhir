var jp = require('jsonpath');
var Card = require('../domain/cds/Card');
var OperationOutcome = require('../domain/fhir/OperationOutcome');
var Parameters = require('../domain/fhir/Parameters');

var service = {

    toFhirResponse: function(ebmedsResponse) {
        return service._createResponse(ebmedsResponse);
    },

    _createResponse: function(ebmedsResponse) {

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

        var cards = service._createReminders(ebmedsResponse);
        cards.push(service._createGuidelink(ebmedsResponse));
        cards.push(service._createFinriskLink(ebmedsResponse));

        return Parameters.create(cards);
    },

    _createReminders: function(ebmedsResponse) {

        var reminders = jp.query(ebmedsResponse, '$..Reminders[*].Reminder[*]');
        
        return reminders.map(function(reminder) {
            return Card.create({
                // FIXME Reminder tekstin valintalogiikka
                summary: reminder.ReminderShort[0] ? reminder.ReminderShort[0] : reminder.ReminderPatient[0],
                detail: reminder.ReminderLong[0] ? reminder.ReminderLong[0] : reminder.ReminderPatient[0],
                sourceLabel: reminder.ScriptID[0],
                sourceUrl: "http://www.ebmeds.org/web/guest/scripts?id=" + reminder.ScriptID[0] + "&lang=fi",
                indicator: service._mapReminderLevel(reminder.ReminderLevel[0]),
                links: []
            });
        });
    },

    _createGuidelink: function(ebmedsResponse) {

        var guidelinks = jp.query(ebmedsResponse, '$..GuidelineLinks[*].GuidelineLink[*]');

        return Card.create({
            summary: "Hoitosuositukset",
            detail: null,
            sourceLabel: "Lisätietoja",
            sourceUrl: "http://www.terveyskirjasto.fi",
            indicator: "info",
            links: guidelinks.map(function(guidelink) {
                return { label: guidelink.GuidelineTitle[0], url: guidelink.GuidelineURL[0] };
            })
        });
    },

    _createFinriskLink: function(ebmedsResponse) {

        var finriskDataset = jp.query(ebmedsResponse, '$..ExperimentalDataSet[?(@.DataSetName=="calculatorFinrisk")]')[0];

        return Card.create({
            summary: "FINRISK calculator",
            detail: "With the FINRISK calculator you can calculate your risk of acute myocardial infarction or acute disorder of the cerebral circulation within the next ten years. The calculator gives your disease risk as a percentage.",
            sourceLabel: "FINRISK calculator - Instructions and interpretation",
            sourceUrl: "https://www.thl.fi/en/web/chronic-diseases/cardiovascular-diseases/finrisk-calculator/instructions",
            indicator: "info",
            links: [{ label: "FINRISK calculator", url: finriskDataset.DataSetText[0] }]
        });
    },

    _mapReminderLevel: function(reminderLevel) {
        switch (reminderLevel) {
            case "0": return "info";
            case "1": return "warning";
            case "2": return "hard-stop";
            default: return "unknown " + "(" + reminderLevel + ")";
        }
    }
};

module.exports =  service;