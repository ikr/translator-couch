describe('emitNamespaces()', function () {
    'use strict';

    var assert = require('assert'),
        sinon = require('sinon'),
        emitNamespaces = require('../src/emitNamespaces');

    it('traverses the namespace hierarchy, including the empty ns', function () {
        var spy = sinon.spy();
        emitNamespaces(spy, {namespace: ['moo', 'goo']});

        assert.strictEqual(spy.callCount, 3);
        assert.deepEqual([spy.args[0][0], spy.args[1][0], spy.args[2][0]], ['moo', 'moo/goo', '']);
    });
});
