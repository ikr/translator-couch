/* jshint camelcase:false */

(function () {
    'use strict';

    var fs = require('fs'),
        devkit = require('couch-js-devkit'),
        hash = require('./hash'),
        emitNamespaces = require('./emitNamespaces'),
        emitByNamespace = require('./emitByNamespace'),
        emitSortedByNamespace = require('./emitSortedByNamespace'),
        compileJs = require('./compileJs'),
        compilePo = require('./compilePo'),

        messageformatJs = fs.readFileSync(
            __dirname + '/../node_modules/messageformat/messageformat.js',
            'utf8'
        ),

        langToPluralFuncMap = fs.readdirSync(
            __dirname + '/../node_modules/messageformat/locale'
        ).map(function (langFileName) {
            var js = fs.readFileSync(
                    __dirname + '/../node_modules/messageformat/locale/' + langFileName,
                    'utf8'
                ),

                lang = /^([a-z]+)\./.exec(langFileName)[1];

            return [lang, [
                'var MessageFormat = {locale: {}};',
                js,
                'module.exports = MessageFormat.locale.' + lang
            ].join('\n')];
        }).reduce(function (memo, pair) {
            memo[pair[0]] = pair[1];
            return memo;
        }, {}),

        md5Js = fs.readFileSync(__dirname + '/../node_modules/blueimp-md5/js/md5.js', 'utf8'),

        language = function (locale) {
            return /^([a-z]+)_/.exec(locale)[1];
        };

    module.exports = function (locale) {
        return {
            lib: {
                locale: 'module.exports = ' + JSON.stringify(locale) + ';',
                language: 'module.exports = ' + JSON.stringify(language(locale)) + ';',
                messageformat: messageformatJs,
                pluralFunc: langToPluralFuncMap[language(locale)],
                compileJs: devkit.couchModuleText(compileJs),
                compilePo: devkit.couchModuleText(compilePo)
            },

            views: {
                lib: {
                    md5: [md5Js, 'module.exports = this.md5;'].join('\n'),
                    hash: devkit.couchModuleText(hash, {md5: 'views/lib/md5'}),
                    emitNamespaces: devkit.couchModuleText(emitNamespaces),
                    emitByNamespace: devkit.couchModuleText(emitByNamespace),
                    emitSortedByNamespace: devkit.couchModuleText(emitSortedByNamespace)
                },

                all_namespaces: {
                    map: function (doc) {
                        var emitNamespaces = require('views/lib/emitNamespaces');
                        emitNamespaces(emit, doc);
                    },

                    reduce: function () { return null; }
                },

                translations: {
                    map: function (doc) {
                        var hash = require('views/lib/hash'),
                            emitByNamespace = require('views/lib/emitByNamespace');

                        emitByNamespace(emit, hash, doc);
                    }
                },

                sorted_translations: {
                    map: function (doc) {
                        var hash = require('views/lib/hash'),
                            emitSortedByNamespace = require('views/lib/emitSortedByNamespace');

                        emitSortedByNamespace(emit, hash, doc);
                    }
                },

                find: {
                    map: function (doc) {
                        var hash = require('views/lib/hash');
                        emit(hash(doc), doc);
                    }
                }
            },

            lists: {
                js: function () {
                    provides('js', function () {
                        var MessageFormat = require('lib/messageformat'),
                            language = require('lib/language'),
                            pluralFunc = require('lib/pluralFunc'),
                            compileJs = require('lib/compileJs');

                        return compileJs(getRow, MessageFormat, language, pluralFunc);
                    });
                },

                po: function () {
                    provides('text', function () {
                        var locale = require('lib/locale'),
                            compilePo = require('lib/compilePo');

                        return compilePo(getRow, locale);
                    });
                }
            }
        };
    };
}());
