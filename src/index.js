const States = require('./states/states');
const Schema = require('./schema');


const privates = new Map();


class Machine {

    static create(spec) {
        Schema.validate(spec);
        return new Machine(spec);
    }

    constructor(spec) {
        // Prevent swapping spec after validation.
        privates.set(this, { spec });
    }

    /**
     * https://states-language.net/spec.html#data
     *
     * "When a state machine is started, the caller can provide an initial JSON
     * text as input, which is passed to the machine's start state as input.
     * If no input is provided, the default is an empty JSON object, {}."
     *
     * This code interprets this to mean undefined or null. This constraint
     * can be relaxed in the future, if necessary.
     */
    run(input) {
        // Explicity cover null as default parameters only are applied when
        // arguments are undefined.
        if (input === undefined || input === null) {
            input = {};
        }

        const { spec } = privates.get(this);
        return States.run(input, spec);
    }

}


module.exports = Machine;
