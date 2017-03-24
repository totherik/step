const mock = require('./__mocktask__');
const  { mixin, Timeout, Retry, Filter } = require('./mixins');


class Task extends mixin(Timeout, Retry, Filter) {

    constructor(spec) {
        super(spec);
        this.resource = spec.Resource;
    }

    _run(input) {
        return mock(input).then(output => ({ output }));
    }

}


module.exports = Task;
