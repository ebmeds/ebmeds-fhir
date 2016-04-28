var pkg = require('../../package.json');
var request1 = require('../views/examples/request-with-context.json');
var request2 = require('../views/examples/request-without-context.json');
var response = require('../views/examples/response-error.json');

exports.index = function(req, res) {

    res.render('index', {
        version: pkg.version,
        request1: JSON.stringify(request1, null, 2),
        request2: JSON.stringify(request2, null, 2),
        response: JSON.stringify(response, null, 2)
    });
};