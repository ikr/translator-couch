/* jshint nomen:false */
/* jshint evil:true  */

describe('compileJs()', function () {
    'use strict';

    var fs = require('fs'),
        assert = require('assert'),
        MessageFormat = require('messageformat'),

        pluralFunc = function (language) {
            var js = fs.readFileSync(
                    __dirname + '/../node_modules/messageformat/locale/' + language + '.js',
                    'utf8'
                ),

                MessageFormat = {locale: {}};

            eval(js);

            return MessageFormat.locale[language];
        },

        compileJs = require('../src/compileJs'),

        stubGetRow = function () {
            var rows = [{
                    value: {
                        _id: 'abc',
                        key: 'hi',
                        translation: 'Hallo {NUM, plural, one {Humanoide} other {# Humanoiden}}',
                        namespace: ['foo', 'bar']

                    }
                }, {
                    value: {
                        _id: 'def',
                        key: 'bye',
                        translation: 'Tschüss',
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

        i18n;

    beforeEach(function () {
        var window = {};
        eval(compileJs(stubGetRow(), MessageFormat, 'de', pluralFunc('de')));
        i18n = window.i18n;
    });

    it('compiles i18n working for constant messages', function () {
        assert.strictEqual(i18n.foo.bye(), 'Tschüss');
    });

    it('compiles i18n working for ICU plurals', function () {
        assert.strictEqual(i18n['foo/bar'].hi({NUM: 3}), 'Hallo 3 Humanoiden');
    });
});
