describe('hash()', function () {
    'use strict';

    var assert = require('assert'),
        crypto = require('crypto'),
        hash = require('../src/hash'),

        md5 = function (s) {
            return crypto.createHash('md5').update(s).digest('hex');
        };

    it('is md5 of namespace concatenated with key', function () {
        assert.strictEqual(
            hash({key: 'moo', namespace: ['foo', 'bar']}),
            md5('foo/barmoo')
        );
    });
});
