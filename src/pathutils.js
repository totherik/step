const JSONPath = require('jsonpath');


const INDEFINITE_TYPES = new Map([
    [ 'script_expression', true ],
    [ 'filter_expression', true ],
    [ 'union', true ],
    [ 'slice', true ],
    [ 'wildcard', true ],
]);


const INDEFINITE_SCOPES = new Map([
    [ 'descendant', true ],
]);


const CACHE = new Map([
    [ '$', true ]
]);


function isDefinitePath(path) {
    if (CACHE.has(path)) {
        return CACHE.get(path);
    }

    const parsed = JSONPath.parse(path);
    const result = !parsed.find(({ expression: { type }, scope }) => {
        // http://goessner.net/articles/JsonPath/
        // https://github.com/jayway/JsonPath#what-is-returned-when
        return INDEFINITE_TYPES.has(type) || INDEFINITE_SCOPES.has(scope);
    });

    CACHE.set(path, result);
    return result;
}


function query(object, path) {
    if (path === '$') {
        return object;
    }

    if (isDefinitePath(path)) {
        return JSONPath.value(object, path);
    }

    return JSONPath.query(object, path);
}


function parse(path) {
    return JSONPath.parse(path);
}


/**
 * Centralized dependency on JSONPath b/c I'm not super happy with it and am
 * entertaining finding a replacement.
 */
module.exports = {
    isDefinitePath,
    query,
    parse,
};
