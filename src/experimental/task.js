const State = require('./mixins/state');
const mixins = require('./mixins/mixins');
const Runner = require('./mixins/runner');
const InputFilter = require('./mixins/inputfilter');
const OutputFilter = require('./mixins/outputfilter');
const ResultFilter = require('./mixins/resultfilter');
const mock = require('./__mocktask__');


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

    match({ Error }) {
        return this.errorEquals.includes(Error);
    }

    isWildcard() {
        return this.errorEquals.length === 1 && this.errorEquals[0] === 'States.ALL'
    }

    run(input) {
        return super.run(input);
    }

}


class Task extends mixins(Runner, InputFilter, OutputFilter, ResultFilter, State) {

    static create(name, spec, factory) {
        const { Resource, TimeoutSeconds = 60, HeartbeatSeconds, Retry, Catch, Next, End } = spec;

        const task = new Task(name, spec);
        task.resource = Resource;
        task.timeoutSeconds = TimeoutSeconds;
        task.heartbeatSeconds = HeartbeatSeconds;
        // task.retry = Retry;
        task.catchers = Catch.map((catcher, index) => Catcher.create(`${name}_Catcher_${index}`, catcher, factory));
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
        this.catchers = undefined;
    }

    _run(input) {
        const task = mock(this);
        return task(input).catch(error => this.catch(error));
    }

    catch(error) {
        const catcher = this.catchers.find((catcher, index, catchers) => {
            if (catcher.match(error)) {
                return true;
            }

            /**
             * 'The reserved name “States.ALL” appearing in a Catcher's “ErrorEquals”
             * field is a wild-card and matches any Error Name. Such a value MUST appear
             * alone in the “ErrorEquals” array and MUST appear in the last Catcher
             * in the “Catch” array.'
             *
             * TODO: See if this rule can be enforced during validation.
             */
            if (index === catchers.length - 1 && catcher.isWildcard()) {
                return true;
            }

            return false;
        });

        if (catcher) {
            return catcher.run(error);
        }

        return Promise.reject(error);
    }

}


module.exports = Task;
