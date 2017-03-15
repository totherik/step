const States = require('./states');
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

    run(input) {
        const { spec } = privates.get(this);
        return States.run(input, spec);
    }

}


module.exports = Machine;
