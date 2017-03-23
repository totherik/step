const mock = require('./__mocktask__');
const  { mixin, Timeout, Catch, Filter } = require('./mixins');


class Task extends mixin(Timeout, Catch, Filter) {

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
