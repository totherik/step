const State = require('./mixins/state');
const Catch = require('./mixins/catch');
const Retry = require('./mixins/retry');
const mixins = require('./mixins/mixins');
const Runner = require('./mixins/runner');
const Timeout = require('./mixins/timeout');
const InputFilter = require('./mixins/inputfilter');
const OutputFilter = require('./mixins/outputfilter');
const ResultFilter = require('./mixins/resultfilter');
const mock = require('./__mocktask__');


class Task extends mixins(Timeout, Catch, Retry, Runner, InputFilter, OutputFilter, ResultFilter, State) {

    constructor(name, spec, factory) {
        super(name, spec, factory);

        const { Resource, HeartbeatSeconds } = spec;
        this.resource = Resource;
        this.heartbeatSeconds = HeartbeatSeconds;
    }

    run(input) {
        const filtered = this.filterInput(input);

        // Using resolved/rejected as I don't want the Promises to chain. A
        // failure in `this.continue` should not trigger `this.catch` and
        // conversely, the result of `this.catch` should not have
        // filters/this.continue executed after.
        const resolved = (result) => {
            result = this.filterResult(filtered, result);
            result = this.filterOutput(result);
            return this.continue(result);
        };

        const rejected = (error) => {
            return this.catch(error);
        }

        return this.retry(input => super.run(input), filtered)
            .then(resolved, rejected);
    }

    _run(input) {
        const task = mock(this);
        const exec = task(input);
        return this.setTimeout(exec);
    }

}


module.exports = Task;
