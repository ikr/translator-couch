/* jshint nomen:false */

(function () {
    'use strict';

    module.exports = function (getRow, locale) {
        var po = '',
            string,
            declaredStrings = {},

            enquote = function (str) {
                return str.replace(new RegExp('["\\\\]', 'g'), '\\$&');
            },

            multiLineTranslation = function (str) {
                var parts = str.split('\n'),
                    msg = 'msgstr ""\n',
                    i;

                for (i = 0; i < parts.length; i = i + 1) {
                    msg = msg + '"' + enquote(parts[i]) + (i + 1 === parts.length ? '' : '\\n') + '"\n';
                }

                return msg;
            },

            multiLineDescription = function (str) {
                var parts = str.split('\n'),
                    descr = '',
                    i;

                for (i = 0; i < parts.length; i = i + 1) {
                    descr = descr + '#. ' + parts[i] + '\n';
                }

                return descr;
            },

            encoding = 'MIME-Version: 1.0\nContent-Type: text/plain; charset=UTF-8\n' +
                'Content-Transfer-Encoding: 8bit\nLanguage: ' + locale + '\n',

            row;

        po = po + '\nmsgid ""\n' + multiLineTranslation(encoding);

        while (true) {
            row = getRow();

            if (!row) {
                break;
            }

            string = row.value;

            if (string.key && !declaredStrings[string._id]) {
                declaredStrings[string._id] = 1;

                po = po + '\n';

                if (string.description && string.description.length) {
                    po = po + multiLineDescription(string.description);
                }

                if (string.namespace && string.namespace.length) {
                    po = po + 'msgctxt "' + enquote(string.namespace.join('/')) + '"\n';
                }

                po = po + 'msgid "' + enquote(string.key)  + '"\n';

                if (string.translation.indexOf('\n') !== -1) {
                    po = po + multiLineTranslation(string.translation);
                }
                else {
                    po = po + 'msgstr "' + enquote(string.translation) + '"\n';
                }
            }
        }

        return  po;
    };
}());
