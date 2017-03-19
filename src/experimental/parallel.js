const State = require('./mixins/state');
const Catch = require('./mixins/catch');
const Retry = require('./mixins/retry');
const mixins = require('./mixins/mixins');
const Runner = require('./mixins/runner');
const InputFilter = require('./mixins/inputfilter');
const OutputFilter = require('./mixins/outputfilter');
const ResultFilter = require('./mixins/resultfilter');


class Parallel extends mixins(Catch, Retry, Runner, InputFilter, OutputFilter, ResultFilter, State) {

    static create(name, spec, factory) {
        const { Branches = [], Next, End } = spec;

        const parallel = new Parallel(name, spec);
        parallel.branches = Branches.map(({ StartAt, States }) => {
            // This is a bit brittle, but allows us to build subtrees
            // without a cyclical 'require' dependency.
            const Factory = factory.constructor;
            return Factory.create(States).build(StartAt);
        });

        // Initialize the Retryable mixin property.
        parallel.retriers = Retry.createRetriers(name, spec, factory);

        // Initialize the Catch mixin property
        parallel.catchers = Catch.createCatchers(name, spec, factory);

        // Initialize the Runner mixin properties.
        parallel.next = factory.build(Next);
        parallel.end = End;

        return parallel;
    }

    static createBranches({ Branches = [] }) {
        return ;
    }

    constructor(name, spec) {
        super(name, spec);
        this.branches = [];
    }

    _run(input) {
        const tasks = this.branches.map(branch => branch.run(input));
        return Promise.all(tasks);
    }

}


module.exports = Parallel;
