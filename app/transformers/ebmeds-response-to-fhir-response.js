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

        if (context.cards.indexOf("reminders") > -1) { service._addReminders(ebmedsResponse, cards, context); }
        if (context.cards.indexOf("guidelink") > -1) { service._addGuideLink(ebmedsResponse, cards); }
        if (context.cards.indexOf("finrisklink") > -1) { service._addFinriskLink(ebmedsResponse, cards); }

        return Parameters.create(cards);
    },

    _addReminders: function(ebmedsResponse, cards, context) {

        var reminders = jp.query(ebmedsResponse, '$..Reminders[*].Reminder[*]');

        reminders.forEach(function(reminder) {
            cards.push(Card.create({
                summary: service._getReminderText(reminder, context.parameters.user.startsWith("Patient") ? "ReminderPatient" : "ReminderShort"),
                detail: service._getReminderText(reminder, context.parameters.user.startsWith("Patient") ? "ReminderPatient" : "ReminderLong"),
                sourceLabel: reminder.ScriptID[0],
                sourceUrl: "http://www.ebmeds.org/web/guest/scripts?id=" + reminder.ScriptID[0] + "&lang=fi",
                indicator: service._mapReminderLevel(reminder.ReminderLevel[0]),
                links: service._getReminderLinks(reminder)
            }));
        });
    },

    _getReminderText: function(reminder, property) {

        var text = service._parseReminderText(reminder, property);

        return text ? text : null;
    },

    _parseReminderText: function(reminder, property) {

        var rm = reminder[property][0];

        // Reminder is object or plain string
        return rm && rm._ ? rm._ : rm ? rm : null;
    },

    _getReminderLinks: function(reminder) {

        return ['ReminderShort', 'ReminderLong', 'ReminderPatient'].reduce(function(links, reminderType) {

            var rm = reminder[reminderType][0];

            if (rm.a) {
                rm.a.forEach(function(link) {
                    links.push({ label: link._, url: link.$.href });
                });
            }

            return links;

        }, []);
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