var moment = require('moment');

var System = {

    create: function(activityInstance, user, language, nation) {

        var now = moment();

        return {
            "User": {
                "HealthCareRole": user.startsWith("Patient") ? "Citizen" : "Physician",
                "HealthCareOrganization": {
                    "CodeValue": "fhirdemo",
                    "CodeSystem": {},
                    "CodeSystemVersion": {}
                },
                "HealthCareSpecialty": {
                    "CodeValue": {},
                    "CodeSystem": {},
                    "CodeSystemVersion": {}
                },
                "Language": {
                    "CodeValue": language,
                    "CodeSystem": "2.16.840.1.113883.6.99",
                    "CodeSystemVersion": {}
                },
                "Nation": {
                    "CodeValue": nation,
                    "CodeSystem": "ISO 3166-1",
                    "CodeSystemVersion": {}
                }
            },
            "Application": {
                "QueryID": activityInstance,
                "DSSVersion": "EBMeDS Basic Interface v1.21",
                "FeedbackType": "S",
                "CheckMoment": {
                    "CheckDate": now.format('YYYY-MM-DD'),
                    "CheckTime": now.format('HH:mm:ss')
                },
                "EventTypes": {
                    "EventType": ["onOpenRecord"]
                }
            }
        };
    }
};

module.exports = System;