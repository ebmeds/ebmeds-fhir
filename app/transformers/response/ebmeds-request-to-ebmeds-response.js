var Promise = require('bluebird');
var xml2js = require('xml2js');
var ebmedsClient = require('../../client/ebmeds-client.js');

var service = {

    transform: function(ebmedsRequest) {

        return new Promise(function(resolve, reject) {

            ebmedsClient.request(ebmedsRequest).then(function(ebmedsResponse) {
                xml2js.parseString(ebmedsResponse, { explicitArray: true }, function(err, ebmedsJsonResponse) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(ebmedsJsonResponse);
                    }
                });
            }).catch(function(err) {
                reject(err);
            });
        });
    }
};

module.exports =  service.transform;