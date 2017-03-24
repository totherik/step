const  { mixin, Filter } = require('./mixins');


class Succeed extends mixin(Filter) {

    constructor(spec) {
        super(spec);
    }

    _run(input) {
        return Promise.resolve({ output: input });
    }

}


module.exports = Succeed;
