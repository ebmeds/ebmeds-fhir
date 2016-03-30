var pkg = require('../../package.json');

exports.index = function(req, res) {
    res.render('index', { version: pkg.version });
};