const State = require('./mixins/state');
const Catch = require('./mixins/catch');
const Retry = require('./mixins/retry');
const mixins = require('./mixins/mixins');
const Runner = require('./mixins/runner');
const InputFilter = require('./mixins/inputfilter');
const OutputFilter = require('./mixins/outputfilter');
const ResultFilter = require('./mixins/resultfilter');


class Parallel extends mixins(Catch, Retry, Runner, InputFilter, OutputFilter, ResultFilter, State) {

    constructor(name, spec, factory) {
        super(name, spec, factory);

        const { Branches = [] } = spec;
        this.branches = Branches.map(({ StartAt, States }) => {
            // This is a bit brittle, but allows us to build subtrees
            // without a cyclical 'require' dependency.
            const Factory = factory.constructor;
            return Factory.create(States).build(StartAt);
        });
    }

    run(input) {
        input = this.filterInput(input);

        return this.retry(input => super.run(input), input)
            .then(result => {
                let output;
                output = this.filterResult(input, result);
                output = this.filterOutput(output);
                return this.continue(output);
            })
            .catch(error => this.catch(error));
    }

    _run(input) {
        const tasks = this.branches.map(branch => branch.run(input));
        return Promise.all(tasks);
    }

}


module.exports = Parallel;
