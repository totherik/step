const ChoiceRule = require('./rule');
const { mixin, Filter } = require('../mixins');


class Choice extends mixin(Filter) {

    constructor(spec) {
        super(spec);
        this.default = spec.Default;
        this.choices = (spec.Choices || []).map(choice => {
            const rule = ChoiceRule.create(choice);
            const next = choice.Next;
            return [ rule, next ];
        });
    }

    _run(input) {
        let goto = this.default;

        for (const [ rule, next ] of this.choices) {
            if (rule(input)) {
                goto = next;
                break;
            }
        }

        this.next = goto;

        return Promise.resolve(input);
    }

}


module.exports = Choice;
