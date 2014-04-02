describe('installed schema', function () {
    'use strict';

    var assert = require('assert'),
        cradle = require('cradle'),
        request = require('request'),
        async = require('async'),
        lodash = require('lodash'),
        devkit = require('couch-js-devkit'),
        schema = require('../src/schema'),

        dbName = function () { return 'test_translator_couch_v_1_0_0'; },
        dbUrl = function () { return 'http://localhost:5984/' + dbName(); },
        db = new cradle.Connection().database(dbName());

    this.timeout(4000);

    beforeEach(function (done) {
        async.series([
            function (callback) {
                request.put(dbUrl(), callback);
            },

            function (callback) {
                async.parallel([
                    function (callback) {
                        devkit.updateSchema(dbName(), 'main', schema('de_CH'), callback);
                    },

                    function (callback) {
                        db.save([{
                            key: 'salutation',
                            translation: 'Dear {GENDER, select, m {Sir} f {Madam}}',
                            namespace: ['foo', 'bar'],
                            description: 'Starts an e-mail body',
                            source: '/hotels-mys/i18n/data/en_US.json'
                        }, {
                            key: 'farewell',
                            translation: 'Bye',
                            namespace: ['foo'],
                            description: 'Can be anywhere',
                            source: '/hotels-mys/client-side-public/app/partials/shared/search-form.html'
                        }], callback);
                    }
                ], callback);
            }
        ], done);
    });

    afterEach(function (done) {
        request.del(dbUrl(), done);
    });

    it('has functional all_namespaces view', function (done) {
        db.view('main/all_namespaces', {group: true}, function (err, rows) {
            assert(!err);
            assert.deepEqual(lodash.pluck(rows, 'key'), ['', 'foo', 'foo/bar']);
            done();
        });
    });

    it('has functional translations view', function (done) {
        db.view('main/translations', function (err, rows) {
            assert(!err);
            assert.strictEqual(lodash.last(rows).key, 'foo/bar');
            done();
        });
    });

    it('has functional sorted_translations view', function (done) {
        db.view('main/sorted_translations', function (err, rows) {
            assert(!err);
            assert.strictEqual(lodash.last(rows).key[0], 'foo/bar');
            done();
        });
    });

    it('has functional find view', function (done) {
        db.view('main/find', function (err, rows) {
            assert(!err);
            assert.strictEqual(rows.length, 2);
            done();
        });
    });

    it('has functional js list', function (done) {
        request(dbUrl() + '/_design/main/_list/js/translations', function (err, resp, body) {
            assert(!err);
            assert.strictEqual(resp.statusCode, 200);
            assert(/i18n/.test(body));
            done();
        });
    });

    it('has functional po list', function (done) {
        request(dbUrl() + '/_design/main/_list/po/translations', function (err, resp, body) {
            assert(!err);
            assert.strictEqual(resp.statusCode, 200);
            assert(/msgstr "Bye"/.test(body));
            done();
        });
    });
});
