const { validate } = require('../schema');
const State = require('./states');


class Machine {

    constructor(spec) {
        this.spec = spec;
        this.validation = validate(spec);
    }

    run(input) {
        const { errors } = this.validation;
        if (errors.length) {
            return Promise.reject(errors[0]);
        }

        return Machine.run(input, this.spec);
    }

    static run(input, spec) {
        const { StartAt, States } = spec;

        let name = StartAt;
        let task = States[name];
        let machine = Promise.resolve(input);

        while (task) {
            const state = State.create(name, task);
            machine = state.run(machine);

            const { End, Type } = task;
            if (End || Type === 'Succeed' || Type === 'Fail') {
                break;
            }

            const { Next } = task;
            name = Next;
            task = States[Next];
        }

        return machine;
    }

}

module.exports = Machine;
