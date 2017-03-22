const mixins = require('./mixins');
const Catch = require('./mixins/catch');
const Retry = require('./mixins/retry');
const Runner = require('./mixins/runner');
const InputFilter = require('./mixins/inputfilter');
const OutputFilter = require('./mixins/outputfilter');
const ResultFilter = require('./mixins/resultfilter');


class Parallel extends mixins(Catch, Retry, Runner, InputFilter, OutputFilter, ResultFilter) {

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
        const filtered = this.filterInput(input);

        // Using resolved/rejected as I don't want the Promises to chain. A
        // failure in `this.continue` should not trigger `this.catch` and
        // conversely, the result of `this.catch` should not have
        // filters/this.continue executed after.
        const resolved = (result) => {
            const output = this.filterResult(filtered, result);
            const input = this.filterOutput(output);
            return this.continue(input);
        };

        const rejected = (error) => {
            return this.catch(error);
        }

        return this
            .retry(input => super.run(input), filtered)
            .then(resolved, rejected);
    }

    _run(input) {
        const tasks = this.branches.map(branch => branch.run(input));
        return Promise.all(tasks);
    }

}


module.exports = Parallel;
