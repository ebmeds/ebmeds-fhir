var Card = require('../../cds/Card');

var Reminder = {
    
    toCards: function(reminders, context) {
        return reminders.map(function(reminder) {
            return Card.create({
                summary: Reminder._getReminderText(reminder, context.parameters.user.startsWith("Patient") ? "ReminderPatient" : "ReminderShort"),
                detail: Reminder._getReminderText(reminder, context.parameters.user.startsWith("Patient") ? "ReminderPatient" : "ReminderLong"),
                sourceLabel: reminder.ScriptID[0],
                sourceUrl: "http://www.ebmeds.org/web/guest/scripts?id=" + reminder.ScriptID[0] + "&lang=" + context.language,
                indicator: Reminder._mapReminderLevel(reminder.ReminderLevel[0]),
                links: Reminder._getReminderLinks(reminder)
            });
        });
    },

    _getReminderText: function(reminder, property) {

        var text = Reminder._parseReminderText(reminder, property);

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

module.exports = Reminder;