/* jshint nomen:false */

(function () {
    'use strict';

    module.exports = function (getRow, MessageFormat, language, pluralFunc, messageformatIncludeJs) {
        var js = '',
            mf = new MessageFormat(language, pluralFunc),
            row,
            string,
            declaredNamespaces = {},
            declaredStrings = {},

            icuCompile = function (expr) {
                try {
                    return mf.precompile(mf.parse(expr));
                }
                catch (e) {
                    return 'function(d){ return \'' + expr.replace(new RegExp('\'', 'g'), '\\\'') + '\'; }';
                }
            };

        while (true) {
            row = getRow();

            if (!row) {
                break;
            }

            string = row.value;

            if (string.key && !declaredStrings[string._id]) {
                declaredStrings[string._id] = 1;

                if (
                    string.namespace && string.namespace.length &&
                    !declaredNamespaces[string.namespace.join('/')]
                ) {
                    js = js + 'g.i18n[\'' + string.namespace.join('/') + '\'] = {};\n';
                    declaredNamespaces[string.namespace.join('/')] = 1;
                }

                js = js + 'g.i18n';

                if (string.namespace && string.namespace.length) {
                    js = js + '[\'' + string.namespace.join('/') + '\']';
                }

                js = js + '[\'' + string.key + '\'] = ' + icuCompile(string.translation) + ';\n';
            }
        }

        return [
            '(function (g) {',
            'var MessageFormat = {locale: {}};',
            'MessageFormat.locale.' + language + ' = ' + pluralFunc.toString() + ';',
            messageformatIncludeJs,
            'g.i18n = {};',
            js,
            '})(window);'
        ].join('\n') + '\n';
    };
}());
