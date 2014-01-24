(function () {
    'use strict';

    module.exports = function (emit, hash, doc) {
        var i,
            combinedNs,
            combinedNsKey,
            clone = function (doc) { return JSON.parse(JSON.stringify(doc)); },
            translation = clone(doc);

        translation.hash = hash(doc);

        if (doc.namespace) {
            combinedNs = '';
            combinedNsKey = doc.namespace.join('/') + ':' + doc.key;

            for (i = 0; i < doc.namespace.length; i = i + 1) {
                combinedNs = combinedNs + doc.namespace[i];
                emit([ combinedNs, combinedNsKey ], translation);
                combinedNs = combinedNs + '/';
            }
        }

        emit(['', doc.key], translation);
    };
}());
