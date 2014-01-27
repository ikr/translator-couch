describe('installed schema', function () {
    'use strict';

    var assert = require('assert'),
        cradle = require('cradle'),
        async = require('async'),
        lodash = require('lodash'),
        devkit = require('couch-js-devkit'),
        schema = require('../src/schema'),

        dbName = function () { return 'test_translator_couch_v_1_0_0'; },
        db = new cradle.Connection().database(dbName());

    beforeEach(function (done) {
        db.create();

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
        ], done);
    });

    afterEach(function (done) {
        db.destroy();
        done();
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
});
