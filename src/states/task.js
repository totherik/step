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
        const task = mock(this);
        const exec = task(input);
        return this.setTimeout(exec);
    }

}


module.exports = Task;
