const PathUtils = require('./pathutils');


/**
 * Operators
 */

function eq(a, b) {
    return a === b;
}

function gt(a, b) {
    return a > b;
}

function gte(a, b) {
    return a >= b;
}

function lt(a, b) {
    return a < b;
}

function lte(a, b) {
    return a <= b;
}


/**
 * Type Validators
 */
function str(value) {
    return typeof value === 'string';
}

function num(value) {
    return typeof value === 'number';
}

function bool(value) {
    return typeof value === 'boolean';
}


/**
 * Timestamp type converter decorator.
 */
function ts(fn) {
    return function (...args) {
        return fn(...args.map(arg => new Date(arg).getTime()));
    };
}


/**
 * Rule Builder
 */
function build(name, type, test) {
    return function rule(_, { Variable = '$', [name]: expected }) {
        return function exec(input) {
            const actual = PathUtils.query(input, Variable);
            return type(expected) && type(actual) && test(actual, expected);
        };
    };
}


module.exports = [

    [ 'StringEquals',               str,  eq  ],
    [ 'StringLessThan',             str,  lt  ],
    [ 'StringGreaterThan',          str,  gt  ],
    [ 'StringLessThanEquals',       str,  lte ],
    [ 'StringGreaterThanEquals',    str,  gte ],
    [ 'NumericEquals',              num,  eq  ],
    [ 'NumericLessThan',            num,  lt  ],
    [ 'NumericGreaterThan',         num,  gt  ],
    [ 'NumericLessThanEquals',      num,  lte ],
    [ 'NumericGreaterThanEquals',   num,  gte ],
    [ 'BooleanEquals',              bool, eq  ],
    [ 'TimestampEquals',            str,  eq  ],
    [ 'TimestampLessThan',          str,  ts(lt)  ],
    [ 'TimestampGreaterThan',       str,  ts(gt)  ],
    [ 'TimestampLessThanEquals',    str,  ts(lte) ],
    [ 'TimestampGreaterThanEquals', str,  ts(gte) ],

].map(([ name, ...args ]) => [ name, build(name, ...args) ]);
