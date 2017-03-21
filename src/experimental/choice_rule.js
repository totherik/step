const operators = require('./choice_operators');


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
        this.impl = () => false;
    }

    satisfiedBy(input) {
        return this.impl(input);
    }

}


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
            return function Or(input) {
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
