const operators = require('./choice_operators');


const ChoiceOperators = new Map([
    [
        'And',
        function ({ And = [] }) {
            const rules = And.map(ChoiceRule.create);
            return function And(input) {
                return rules.every(rule => rule(input));
            };
        },
    ],
    [
        'Or',
        function ({ Or = [] }) {
            const rules = Or.map(ChoiceRule.create);
            return function Or(input) {
                return rules.some(rule => rule(input));
            };
        }
    ],
    [
        'Not',
        function ({ Not }) {
            const rule = ChoiceRule.create(Not);
            return function Not(input) {
                return !rule(input);
            };
        }
    ],
    ...operators,
]);


class ChoiceRule {

    static create(spec) {
        let impl = () => false;

        for (const [ operator, fn ] of ChoiceOperators.entries()) {
            if (spec.hasOwnProperty(operator)) {
                impl = fn(spec);
                break;
            }
        }

        return impl;
    }

}


module.exports = ChoiceRule;
