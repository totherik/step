const { validate } = require('../schema');
const State = require('./states');


class Machine {

    constructor(spec) {
        this.spec = spec;
    }

    run(input) {
        const { spec } = this;
        const { errors } = validate(spec);

        if (errors.length) {
            return Promise.reject(errors[0]);
        }

        return Machine.run(input, spec);
    }

    static run(input, spec) {
        const { StartAt, States } = spec;

        let name = StartAt;
        let task = States[name];
        let promise = Promise.resolve(input);

        while (task) {
            const state = State.create(name, task);
            promise = state.run(promise);

            const { End, Type } = task;
            if (End || Type === 'Succeed' || Type === 'Fail') {
                break;
            }

            const { Next } = task;
            name = Next;
            task = States[Next];
        }

        return promise;
    }

}

module.exports = Machine;
