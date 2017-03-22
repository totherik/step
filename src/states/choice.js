const Fail = require('./fail');
const mixins = require('./mixins');
const State = require('./mixins/state');
const Runner = require('./mixins/runner');
const ChoiceRule = require('./choice_rule');
const InputFilter = require('./mixins/inputfilter');
const OutputFilter = require('./mixins/outputfilter');


class Choice extends mixins(Runner, InputFilter, OutputFilter, State) {

    static fail(name, factory) {
        const spec = {
            Error: 'States.NoChoiceMatched',
            Cause: `All Choices failed for State "${name}" and no Default specified.`
        };
        return new Fail(`${name}_Fail`, spec, factory);
    }

    constructor(name, spec, factory) {
        super(name, spec, factory);

        const { Choices = [], Default } = spec;

        this.choices = Choices.map((spec, index) => {
            const rule = ChoiceRule.create(`${name}_ChoiceRule_${index}`, spec);
            const next = factory.build(spec.Next);
            return [ rule, next ];
        });

        this.default = factory.build(Default) || Choice.fail(name, factory);
    }

    run(input) {
        const filtered = this.filterInput(input);
        const next = this.choose(filtered);

        return super.run(filtered)
            .then(result => this.filterOutput(result))
            .then(output => this.continue(output, next));
    }

    _run(input) {
        return Promise.resolve(input);
    }

    choose(input) {
        for (const [ rule, next ] of this.choices) {
            if (rule.satisfiedBy(input)) {
                return next;
            }
        }

        return this.default;
    }

}


module.exports = Choice;
