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

    static create(name, spec, factory) {
        const { Resource, TimeoutSeconds = 60, HeartbeatSeconds, Next, End } = spec;

        const task = new Task(name, spec);
        task.resource = Resource;

        // Initialize the Timeout mixin property.
        task.timeoutSeconds = TimeoutSeconds;
        task.heartbeatSeconds = HeartbeatSeconds;

        // Initialize the Retryable mixin property.
        task.retriers = Retry.createRetriers(name, spec, factory);

        // Initialize the Catch mixin property
        task.catchers = Catch.createCatchers(name, spec, factory);

        // Initialize the Runner mixin properties.
        task.next = factory.build(Next);
        task.end = End;

        return task;
    }

    constructor(name, spec) {
        super(name, spec);
        this.resource = undefined;
        // this.timeoutSeconds = undefined;
        // this.heartbeatSeconds = undefined;
    }

    _run(input) {
        const task = mock(this);
        const exec = task(input);
        return this.setTimeout(exec);
    }

}


module.exports = Task;
