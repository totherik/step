const State = require('./mixins/state');
const mixins = require('./mixins/mixins');
const Runner = require('./mixins/runner');
const InputFilter = require('./mixins/inputfilter');
const OutputFilter = require('./mixins/outputfilter');
const ResultFilter = require('./mixins/resultfilter');


class Catcher extends mixins(Runner) {

    static create(name, spec, factory) {
        const { ErrorEquals, Next } = spec;

        const catcher = new Catcher(name, spec);
        catcher.errorEquals = ErrorEquals;
        catcher.next = factory.build(Next);
        return catcher;
    }

    constructor(name, spec) {
        super(name, spec);
        this.errorEquals = undefined;
        this.next = undefined;
    }

    run(input) {
        return this.next.run(input);
    }

}


class Task extends mixins(Runner, InputFilter, OutputFilter, ResultFilter, State) {

    static create(name, spec, factory) {
        const { Resource, Retry, Catch, Next, End } = spec;

        const task = new Task(name, spec);
        task.resource = Resource;
        // task.retry = Retry;
        task.catch = Catch.map((catcher, index) => Catcher.create(`${name}_Catcher_${index}`, catcher, factory));
        task.next = factory.build(Next);
        task.end = End;
        return task;
    }

    constructor(name, spec) {
        super(name, spec);
        this.resource = undefined;
        // this.retry = undefined;
        this.catch = undefined;
    }

    _run(input) {
        return Promise.resolve(input);
    }

}


module.exports = Task;
