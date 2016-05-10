var System = {

    create: function(activityInstance, user, language, nation) {

        return {
            "User": {
                "HealthCareRole": user.startsWith("Patient") ? "Citizen" : "Physician",
                "HealthCareOrganization": {
                    "CodeValue": {},
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
                "FeedbackType": "S"
            }
        };
    }
};

module.exports = System;