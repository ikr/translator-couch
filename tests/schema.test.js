/* jshint camelcase:false */

describe('schema()', function () {
    'use strict';

    var assert = require('assert'),
        schema = require('../src/schema');

    describe('defined functions and values', function () {
        var s;

        beforeEach(function () {
            s = schema('nl_NL');
        });

        it('include the locale', function () {
            assert(/nl_NL/.test(s.lib.locale));
        });

        it('include lib/messageformat', function () {
            assert(/function/.test(s.lib.messageformat));
        });

        it('include lib/pluralFunc', function () {
            assert(/function/.test(s.lib.pluralFunc));
        });

        it('include views/lib/md5', function () {
            assert(/function/.test(s.views.lib.md5));
        });

        it('include views/lib/hash', function () {
            assert(/function/.test(s.views.lib.hash));
        });

        it('include views/lib/emitNamespaces', function () {
            assert(/function/.test(s.views.lib.emitNamespaces));
        });

        it('include views/all_namespaces/map', function () {
            assert(s.views.all_namespaces.map);
        });

        it('include views/all_namespaces/reduce', function () {
            assert(s.views.all_namespaces.reduce);
        });
    });
});
