const State = require('./mixins/state');
const mixins = require('./mixins/mixins');
const Runner = require('./mixins/runner');
const InputFilter = require('./mixins/inputfilter');
const OutputFilter = require('./mixins/outputfilter');


class Choice extends mixins(Runner, InputFilter, OutputFilter, State) {

    static create(name, spec, factory) {

    }

    constructor(name, spec) {
        super(name, spec);
        this.choices = [];
    }

    _run(input) {
        return input;
    }

}


module.exports = Choice;
