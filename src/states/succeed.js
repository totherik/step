const mixins = require('./mixins');
const State = require('./mixins/state');
const InputFilter = require('./mixins/inputfilter');
const OutputFilter = require('./mixins/outputfilter');


class Succeed extends mixins(InputFilter, OutputFilter, State) {

    constructor(name, spec, factory) {
        super(name, spec, factory);
    }

    run(input) {
        return Promise.resolve(input)
            .then(input => this.filterInput(input))
            .then(filtered => super.run(filtered))
            .then(output => this.filterOutput(output));
    }

    _run(input) {
        return Promise.resolve(input);
    }

}


module.exports = Succeed;
