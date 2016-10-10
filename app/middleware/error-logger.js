var winston = require('winston');

module.exports = function() {

    var logger = new winston.Logger({
        transports: [new winston.transports.Console({
            level: 'error',
            humanReadableUnhandledException: true,
            handleExceptions: true,
            json: false
        })]
    });

    return function(err, req, res, next) {
        logger.error(err);
        next(err);
    };
};