const Fail = require('./fail');
const State = require('./mixins/state');
const mixins = require('./mixins/mixins');
const ChoiceRule = require('./choice_rule');
const InputFilter = require('./mixins/inputfilter');
const OutputFilter = require('./mixins/outputfilter');


class Choice extends mixins(InputFilter, OutputFilter, State) {

    static create(name, spec, factory) {
        const { Choices, Default } = spec;

        const ruleset = Choices.map((spec, index) => {
            const rule = ChoiceRule.create(`${name}_ChoiceRule_${index}`, spec);
            const next = factory.build(spec.Next);
            return [ rule, next ];
        });

        const choice = new Choice(name, spec);
        choice.choices = new Map(ruleset);
        choice.default = factory.build(Default);
        return choice;
    }

    constructor(name, spec) {
        super(name, spec);
        this.choices = [];
    }

    run(input) {
        // NOTE: This behavior does not rely on the Runner mixin, but instead
        // replaces the runner behavior with Default and ChoiceRule Next
        // values depending on the choice outcome.
        const next = this.choose(input);
        return super.run(input).then(output => next.run(output));
    }

    _run(input) {
        return input;
    }

    choose(input) {
        for (const [ rule, next ] of this.choices) {
            if (rule.satisfiedBy(input)) {
                return next;
            }
        }

        if (this.default) {
            return this.default;
        }

        const spec = {
            Error: 'States.NoChoiceMatched',
            Cause: `All Choices failed for State "${this.name}" and no Default specified.`
        };

        return Fail.create(`${this.name}_Fail`, spec);
    }

}


module.exports = Choice;
