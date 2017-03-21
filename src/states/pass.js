const State = require('./mixins/state');
const mixins = require('./mixins/mixins');
const Runner = require('./mixins/runner');
const InputFilter = require('./mixins/inputfilter');
const OutputFilter = require('./mixins/outputfilter');
const ResultFilter = require('./mixins/resultfilter');


class Pass extends mixins(Runner, InputFilter, OutputFilter, ResultFilter, State) {

    constructor(name, spec, factory) {
        super(name, spec, factory);

        const { Result } = spec;
        this.result = Result;
    }


    run(input) {
        input = this.filterInput(input);

        return super.run(input)
            .then(result => {
                let output;
                output = this.filterResult(input, result);
                output = this.filterOutput(output);
                return this.continue(output);
            });
    }

    _run(input) {
        const { result = input } = this;
        return Promise.resolve(result);
    }

}


module.exports = Pass;
