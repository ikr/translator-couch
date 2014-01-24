(function () {
    'use strict';

    var fs = require('fs'),

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

        language = function (locale) {
            return /^([a-z]+)_/.exec(locale)[1];
        };

    module.exports = function (locale) {
        return {
            lib: {
                locale: 'module.exports = ' + JSON.stringify(locale) + ';',
                messageformat: messageformatJs,
                pluralFunc: langToPluralFuncMap[language(locale)]
            }
        };
    };
}());
