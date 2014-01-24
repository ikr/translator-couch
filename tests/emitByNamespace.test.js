describe('emitByNamespace', function () {
    'use strict';

    var assert = require('assert'),
        sinon = require('sinon'),
        emitByNamespace = require('../src/emitByNamespace'),
        hash = function (doc) { return doc.translation.toLowerCase(); },

        document = function () {
            return {
                translation: 'Book',
                namespace: ['fook', 'hook']
            };
        },

        spy;

    beforeEach(function () {
        spy = sinon.spy();
        emitByNamespace(spy, hash, document());
    });

    it('traverses the namespace hierarchy, including the empty ns', function () {
        assert.strictEqual(spy.callCount, 3);

        assert.deepEqual(
            [spy.args[0][0], spy.args[1][0], spy.args[2][0]], ['fook', 'fook/hook', '']);
    });

    it('adds the hash to to the emitted doc', function () {
        assert.deepEqual(spy.args[0][1], {
            translation: 'Book',
            namespace: ['fook', 'hook'],
            hash: 'book'
        });
    });
});
