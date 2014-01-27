(function () {
    'use strict';

    var async = require('async'),
        request = require('request'),
        devkit = require('couch-js-devkit'),
        schema = require('./src/schema');

    module.exports = function (dbNamePrefix, locales, callback) {
        async.each(locales, function (locale, callback) {
            var dbName = dbNamePrefix + locale.toLowerCase();

            async.series([
                function (callback) {
                    request.put('http://localhost:5984/' + dbName, callback);
                },

                function (callback) {
                    devkit.updateSchema(dbName, 'main', schema(locale), callback);
                }
            ], callback);
        }, callback);
    };
}());
