var rp = require('request-promise');
var config = require('config');

exports.request = function(payload) {

    var options = {
        method: 'POST',
        uri: config.get('ebmeds.url'),
        form: {
            dssData: payload
        }
    };

    return rp(options);
};