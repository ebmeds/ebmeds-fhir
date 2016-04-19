var pkg = require('../../package.json');
var request1 = require('../client/request-mock-incoming-with-context.json');
var request2 = require('../client/request-mock-incoming-without-context.json');

exports.index = function(req, res) {
    res.render('index', {
        version: pkg.version,
        request1: JSON.stringify(request1, null, 2),
        request2: JSON.stringify(request2, null, 2)
    });
};