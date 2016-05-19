var winston = require('winston');

module.exports = function(options) {

    var logger = new winston.Logger({
        transports: options.transports
    });

    return function(err, req, res, next) {
        logger.error(err);
        next(err);
    };
};