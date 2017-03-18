const State = require('./mixins/state');
const mixins = require('./mixins/mixins');
const Runner = require('./mixins/runner');
const Catchable = require('./mixins/catchable');
const InputFilter = require('./mixins/inputfilter');
const OutputFilter = require('./mixins/outputfilter');
const ResultFilter = require('./mixins/resultfilter');
const mock = require('./__mocktask__');


class Task extends mixins(Catchable, Runner, InputFilter, OutputFilter, ResultFilter, State) {

    static create(name, spec, factory) {
        const { Resource, TimeoutSeconds = 60, HeartbeatSeconds, Retry = [], Catch = [], Next, End } = spec;

        const task = new Task(name, spec);
        task.resource = Resource;
        task.timeoutSeconds = TimeoutSeconds;
        task.heartbeatSeconds = HeartbeatSeconds;
        // task.retry = Retry;
        task.catchers = Catchable.createCatchers(name, spec, factory);
        task.next = factory.build(Next);
        task.end = End;
        return task;
    }

    constructor(name, spec) {
        super(name, spec);
        this.resource = undefined;
        this.timeoutSeconds = undefined;
        this.heartbeatSeconds = undefined;
        // this.retry = undefined;
    }

    _run(input) {
        const task = mock(this);
        return task(input);
    }

}


module.exports = Task;
