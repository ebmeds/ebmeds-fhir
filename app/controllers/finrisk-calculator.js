var express = require('express');
var router = express.Router();
var pipe = require('../transformers/pipe');

router.post('/\\$cds-hook', function(req, res, next) {

    var context = {
        requestParams: req.query || {},
        language: "en",
        nation: "us",
        cards: ["reminders", "guidelink", "finrisklink"]
    };

    pipe.execute(req, res, next, context);
});

router.get('/\\$cds-hook-metadata', function(req, res, next) {

    res.json({
        "resourceType" : "Parameters",
        "parameter" : [{
            "name" : "name",
            "valueString" : "EBMeDS Finrisk calculator"
        }, {
            "name" : "description",
            "valueString" : "EBMeDS Finrisk calculator"
        }, {
            "name" : "activity",
            "valueCoding" : {
                "system" : "http://cds-hooks.smarthealthit.org/activity",
                "code" : "patient-view"
            }
        }
        ]
    });
});

module.exports = router;