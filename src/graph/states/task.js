const mixins = require('./mixins');
const Catch = require('./mixins/catch');
const Filter = require('./mixins/filter');
const Timeout = require('./mixins/timeout');
const mock = require('./__mocktask__');


class Task extends mixins(Timeout, Catch, Filter) {

    constructor(spec) {
        super(spec);
        this.resource = spec.Resource;
    }

    _run(input) {
        // TODO: Retry
        const exec = mock(this);
        return exec(input);
    }

}


module.exports = Task;
