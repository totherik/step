const State = require('./mixins/state');
const mixins = require('./mixins/mixins');
const Runner = require('./mixins/runner');
const InputFilter = require('./mixins/inputfilter');
const OutputFilter = require('./mixins/outputfilter');


class Wait extends mixins(Runner, InputFilter, OutputFilter, State) {

    static create(name, spec, factory) {
        const { Seconds = 0, Next, End = false } = spec;
        
        const wait = new Wait(name, spec);
        wait.seconds = Seconds;
        wait.next = factory.build(Next);
        wait.end = End;
        return wait;
    }

    constructor(name, spec) {
        super(name, spec);
        this.seconds = undefined;
    }

    _run(input) {
        return new Promise(resolve => {
            setTimeout(resolve, this.seconds * 1000, input);
        });
    }

}


module.exports = Wait;
