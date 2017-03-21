const State = require('./mixins/state');
const mixins = require('./mixins/mixins');
const InputFilter = require('./mixins/inputfilter');
const OutputFilter = require('./mixins/outputfilter');


class Succeed extends mixins(InputFilter, OutputFilter, State) {

    constructor(name, spec, factory) {
        super(name, spec, factory);
    }

    run(input) {
        input = this.filterInput(input);
        return super.run(input).then(result => this.filterOutput(result));
    }

}


module.exports = Succeed;
