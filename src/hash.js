(function () {
    'use strict';

    var md5 = require('blueimp-md5').md5;

    module.exports = function (doc) {
        return md5((doc.namespace || []).join('/') + doc.key);
    };
}());
