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


function rule({ expression: { type }, scope }) {
    // http://goessner.net/articles/JsonPath/
    // https://github.com/jayway/JsonPath#what-is-returned-when
    return INDEFINITE_TYPES.has(type) || INDEFINITE_SCOPES.has(scope);
}


function isDefinitePath(path) {
    // TODO: Cache query results for perf.
    // TODO: Can also optimize for '$'
    const operations = JSONPath.parse(path);
    return !operations.find(rule);
}


function query(object, path) {
    if (path === null) {
        return {};
    }

    if (isDefinitePath(path)) {
        return JSONPath.value(object, path);
    }

    return JSONPath.query(object, path);
}


module.exports = {
    isDefinitePath,
    query,
};
