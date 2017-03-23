const  { mixin, Filter } = require('./mixins');


class Pass extends mixin(Filter) {

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
