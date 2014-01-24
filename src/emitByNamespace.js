(function () {
    'use strict';

    module.exports = function (emit, hash, doc) {
        var i,
            combinedNs,
            clone = function (doc) { return JSON.parse(JSON.stringify(doc)); },
            translation = clone(doc);

        translation.hash = hash(doc);

        if (doc.namespace) {
            combinedNs = '';
            for (i = 0; i < doc.namespace.length; i = i + 1) {
                combinedNs = combinedNs + doc.namespace[i];
                emit(combinedNs, translation);
                combinedNs = combinedNs + '/';
            }
        }

        emit('', translation);
    };
}());
