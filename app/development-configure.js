module.exports = function(app) {
    app.use(require('./middleware/error-logger')());
    app.use(require('./middleware/error-response')({ stacktrace: true }));
};