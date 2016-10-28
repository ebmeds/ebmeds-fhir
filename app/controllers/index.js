var express = require('express');
var router = express.Router();

router.use('/health-coaching', require('./health-coaching'));
router.use('/finrisk-calculator', require('./finrisk-calculator'));
router.use('/patient-view', require('./patient-view'));
router.use('/medication-review', require('./medication-review'));

router.get('/', function(req, res) {
    res.render('index', {
        rev: require('../../revision.json').rev,
        version: require('../../package.json').version,
        request1: JSON.stringify(require('../views/examples/request-with-context.json'), null, 2),
        request2: JSON.stringify(require('../views/examples/request-without-context.json'), null, 2),
        response: JSON.stringify(require('../views/examples/response-error.json'), null, 2)
    });
});

module.exports = router;