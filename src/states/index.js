const State = require('./state');


class States {

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


module.exports = States;
