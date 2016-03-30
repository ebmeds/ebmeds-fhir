var hello = require('../services/hello.js');

exports.msg = function(req, res) {
    res.json({ msg: hello.msg() });
};