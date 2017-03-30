const Rule = require('./rule');
const { mixin, Filter } = require('../mixins');


class Choice extends mixin(Filter) {

    constructor(spec) {
        super(spec);
        this.default = spec.Default;

        const choices = spec.Choices || [];
        this.choices = choices.map(choice => {
            const rule = Rule.create(choice);
            const destination = choice.Next;
            return [ rule, destination ];
        });
    }

    _run(input) {
        let next = this.default;

        for (const [ rule, destination ] of this.choices) {
            if (rule(input)) {
                next = destination;
                break;
            }
        }

        return Promise.resolve({ output: input, next });
    }

}


module.exports = Choice;
