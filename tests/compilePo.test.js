/* jshint nomen:false */

describe('compilePo()', function () {
    'use strict';

    var assert = require('assert'),
        compilePo = require('../src/compilePo'),

        stubGetRow = function () {
            var rows = [{
                    value: {
                        _id: 'abc',
                        key: 'hi',
                        translation: 'Hi {NAME}',
                        description: 'Greeting',
                        namespace: ['foo', 'bar']

                    }
                }, {
                    value: {
                        _id: 'def',
                        key: 'bye',
                        translation: 'Bye {NAME}',
                        description: 'Farewell',
                        namespace: ['foo']
                    }
                }],

                index = 0;

            return function () {
                if (rows[index]) {
                    index = index + 1;
                    return rows[index - 1];
                }
            };
        },

        po;

    beforeEach(function () {
        po = compilePo(stubGetRow(), 'en_US');
    });

    it('outputs the content-type header', function () {
        assert(/Content-Type: /.test(po));
    });

    it('outputs the language header with full locale', function () {
        assert(/Language: en_US/.test(po));
    });

    it('outputs a description', function () {
        assert(/#\. Farewell/.test(po));
    });

    it('outputs a context', function () {
        assert(/msgctxt "foo\/bar"/.test(po));
    });

    it('outputs an id', function () {
        assert(/msgid "bye"/.test(po));
    });

    it('outputs a translation', function () {
        assert(/msgstr "Hi {NAME}"/.test(po));
    });
});
