const Fail = require('./fail');
const State = require('./mixins/state');
const mixins = require('./mixins/mixins');
const ChoiceRule = require('./choice_rule');
const InputFilter = require('./mixins/inputfilter');
const OutputFilter = require('./mixins/outputfilter');


class Choice extends mixins(InputFilter, OutputFilter, State) {

    constructor(name, spec, factory) {
        super(name, spec, factory);

        const { Choices = [], Default } = spec;

        this.choices = Choices.map((spec, index) => {
            const rule = ChoiceRule.create(`${name}_ChoiceRule_${index}`, spec);
            const next = factory.build(spec.Next);
            return [ rule, next ];
        });

        this.default = factory.build(Default) || (function (name, factory) {
            const spec = {
                Error: 'States.NoChoiceMatched',
                Cause: `All Choices failed for State "${name}" and no Default specified.`
            };
            return new Fail(`${name}_Fail`, spec, factory);
        })(name, factory);
    }

    run(input) {
        const filtered = this.filterInput(input);

        return super.run(filtered)
            .then(result => this.filterOutput(result))
            .then(result => this.choose(filtered).run(result));
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
