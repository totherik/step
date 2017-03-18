const State = require('./mixins/state');
const mixins = require('./mixins/mixins');
const Runner = require('./mixins/runner');
const InputFilter = require('./mixins/inputfilter');
const OutputFilter = require('./mixins/outputfilter');
const ResultFilter = require('./mixins/resultfilter');


class Pass extends mixins(Runner, InputFilter, OutputFilter, ResultFilter, State) {

    static create(name, spec, factory) {
        const { Result, Next, End = false } = spec;

        const pass = new Pass(name, spec);
        pass.result = Result;
        pass.next = factory.build(Next);
        pass.end = End;
        return pass;
    }

    constructor(name, spec) {
        super(name, spec);
        this.result = undefined;
    }

    _run(input) {
        const { result = input } = this;
        return result;
    }
}


module.exports = Pass;
