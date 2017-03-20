const PathUtils = require('../pathutils');


class ChoiceRule {

    static create(name, spec) {
        const rule = new ChoiceRule(name);

        for (const [ operator, fn ] of ChoiceOperators.entries()) {
            if (spec.hasOwnProperty(operator)) {
                rule.impl = fn(name, spec);
                break;
            }
        }

        return rule;
    }

    constructor(name) {
        this.name = name;
        this.impl = undefined;
    }

    satisfiedBy(input) {
        return this.impl(input);
    }

}


function typeOf(type) {
    return function (value) {
        return typeof value === type;
    };
}

function eq(b) {
    return function (a) {
        return a === b;
    };
}

function gt(b) {
    return function (a) {
        return a > b;
    };
}

function gte(b) {
    return function (a) {
        return a >= b;
    };
}

function lt(b) {
    return function (a) {
        return a < b;
    };
}

function lte(b) {
    return function (a) {
        return a <= b;
    };
}

function op(operator, type, assertion) {
    return function (name, { Variable = '$', [operator]: expected }) {
        const test = assertion(expected);
        return function (input) {
            const actual = PathUtils.query(input, Variable);
            return (typeof actual === type) && test(actual);
        };
    };
}


const operators = [
    [ 'StringEquals', 'string', eq ],
    [ 'StringLessThan', 'string', lt ],
    [ 'StringGreaterThan', 'string', gt ],
    [ 'StringLessThanEquals', 'string', lte ],
    [ 'StringGreaterThanEquals', 'string', gte ],
].map(([ name, ...args ]) => [ name, op(name, ...args) ]);


const ChoiceOperators = new Map([
    [
        'And',
        function (name, { And }) {
            const rules = And.map((rule, index) => ChoiceRule.create(`${name}_And_${index}`, rule));
            return function And(input) {
                return rules.every(rule => rule.satisfiedBy(input));
            };
        },
    ],
    [
        'Or',
        function (name, { Or }) {
            const rules = Or.map((rule, index) => ChoiceRule.create(`${name}_Or_${index}`, rule));
            return function And(input) {
                return rules.some(rule => rule.satisfiedBy(input));
            };
        }
    ],
    [
        'Not',
        function (name, { Not }) {
            const rule = ChoiceRule.create(`${name}_Not`, Not);
            return function Not(input) {
                return !rule.satisfiedBy(input);
            };
        }
    ],
    ...operators
]);


module.exports = ChoiceRule;
