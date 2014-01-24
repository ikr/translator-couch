(function () {
    'use strict';

    module.exports = function (emit, doc) {
        var i, combinedNs;

        if (doc.namespace) {
            combinedNs = '';

            for (i = 0; i < doc.namespace.length; i = i + 1) {
                combinedNs = combinedNs + doc.namespace[i];
                emit(combinedNs, null);
                combinedNs = combinedNs + '/';
            }
        }

        emit('', null);
    };
}());
