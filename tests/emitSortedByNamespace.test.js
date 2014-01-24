describe('emitSortedByNamespace', function () {
    'use strict';

    var assert = require('assert'),
        sinon = require('sinon'),
        emitSortedByNamespace = require('../src/emitSortedByNamespace'),
        hash = function (doc) { return doc.translation.toUpperCase(); },

        document = function () {
            return {
                key: 'book',
                translation: 'Book',
                namespace: ['fook', 'hook']
            };
        },

        spy;

    beforeEach(function () {
        spy = sinon.spy();
        emitSortedByNamespace(spy, hash, document());
    });

    it('traverses the namespace hierarchy, including the empty ns', function () {
        assert.strictEqual(spy.callCount, 3);

        assert.deepEqual(
            [spy.args[0][0], spy.args[1][0], spy.args[2][0]],
            [['fook', 'fook/hook:book'], ['fook/hook', 'fook/hook:book'], ['', 'book']]
        );
    });

    it('adds the hash to to the emitted doc', function () {
        assert.deepEqual(spy.args[0][1], {
            key: 'book',
            translation: 'Book',
            namespace: ['fook', 'hook'],
            hash: 'BOOK'
        });
    });
});
