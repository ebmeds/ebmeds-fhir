var winston = require('winston');

module.exports = function(app) {

    app.use(require('./middleware/error-logger')({ transports: [
        new winston.transports.File({
            name: "errorFileLog",
            filename: "error.log",
            level: 'error',
            humanReadableUnhandledException: true,
            handleExceptions: true,
            json: false
        })
    ]}));

    app.use(require('./middleware/error-response')({ stacktrace: false }));
};