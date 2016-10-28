var express = require('express');
var router = express.Router();
var pipe = require('../transformers/pipe');

router.post('/\\$cds-hook', function(req, res, next) {

    var context = {
        requestParams: req.query || {},
        language: "en_US",
        nation: "US",
        cards: ["cmrlink"]
    };

    pipe.execute(req, res, next, context);
});

router.get('/\\$cds-hook-metadata', function(req, res, next) {

    res.json({
        "resourceType" : "Parameters",
        "parameter" : [{
            "name" : "name",
            "valueString" : "EBMeDS patient view"
        }, {
            "name" : "description",
            "valueString" : "EBMeDS patient view"
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