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

            /**
             * Terminal State
             * https://states-language.net/spec.html#terminal-state
             *
             * "Any state except for Choice, Succeed, and Fail MAY have a
             * field named "End" whose value MUST be a boolean. The term
             * 'Terminal State' means a state with with { 'End': true }, or
             * a state with { 'Type': 'Succeed' }, or a state with
             * { 'Type': 'Fail' }."
             */
            const { End, Type } = task;
            if (End || Type === 'Succeed' || Type === 'Fail') {
                break;
            }

            const { Next } = task;
            name = Next;
            task = States[Next];

            if (!task) {
                /**
                 * TODO: https://github.com/totherik/step/issues/1
                 * This should not be done at runtime.
                 * Also, don't abandon the existing promise chain, so
                 * procced, break the while, and return.
                 */
                const error = new Error(`State "${name}" not defined.`);
                promise = promise.then(() => Promise.reject(error));
            }
        }

        return promise;
    }

}


module.exports = States;
