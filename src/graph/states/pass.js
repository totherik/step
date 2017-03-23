const mixins = require('./mixins');
const Filter = require('./mixins/filter');


class Pass extends mixins(Filter) {

    constructor(spec) {
        super(spec);
        this.result = spec.Result;
    }

    _run(input) {
        const { result = input } = this;
        return Promise.resolve(result);
    }

}


module.exports = Pass;
