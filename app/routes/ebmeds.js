var fs = require('fs');
var xml2js = require('xml2js');
var ebmeds = require('../client/ebmeds.js');

exports.test = function(req, res) {

    var payload = fs.readFileSync('request.xml','utf8');

    ebmeds.request(payload).then(function(response) {
        
        xml2js.parseString(response, function(err, result) {
            res.json(result);
        });
    });
};