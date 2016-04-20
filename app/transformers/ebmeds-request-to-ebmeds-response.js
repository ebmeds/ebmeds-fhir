var Promise = require('bluebird');
var xml2js = require('xml2js');
var ebmedsClient = require('../client/ebmeds-client.js');

var service = {

    toEbmedsResponse: function(ebmedsRequest) {

        return new Promise(function(resolve, reject) {

            ebmedsClient.request(ebmedsRequest).then(function(ebmedsResponse) {
                xml2js.parseString(ebmedsResponse, { explicitArray: true }, function(err, ebmedsJsonResponse) {
                    resolve(ebmedsJsonResponse);
                });
            });
        });
    }
};

module.exports =  service;