const State = require('./mixins/state');
const mixins = require('./mixins/mixins');
const InputFilter = require('./mixins/inputfilter');
const OutputFilter = require('./mixins/outputfilter');


class Succeed extends mixins(InputFilter, OutputFilter, State) {

    static create(name, spec, factory) {
        return new Succeed(name, spec);
    }

    constructor(name, spec) {
        super(name, spec);
    }

    run(input) {
        return Promise.resolve(input);
    }

}


module.exports = Succeed;
