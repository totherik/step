const State = require('./state');


class States {

    static run(input, spec) {

        function advance(input, name, states) {

            const state = states[name];
            if (!state) {
                /**
                 * TODO: https://github.com/totherik/step/issues/1
                 * This should not be done at runtime.
                 */
                const error = new Error(`State "${name}" not defined.`);
                return Promise.reject(error);
            }

            const exec = State.create(name, state).run(input);

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
            const { Type } = state;
            if (Type === 'Succeed' || Type === 'Fail') {
                return exec;
            }

            const { End, Next, Catch } = state;
            return exec
                .then(output => End ? output : advance(output, Next, states))
                .catch(output => catcher(output, Catch, states));
        }

        function catcher(output, Catch = [], states) {
            const { Error } = output;

            const catcher = Catch.find(({ ErrorEquals }, index, catchers) => {
                if (ErrorEquals.includes(Error)) {
                    return true;
                }

                /**
                 * 'The reserved name “States.ALL” appearing in a Catcher's “ErrorEquals”
                 * field is a wild-card and matches any Error Name. Such a value MUST appear
                 * alone in the “ErrorEquals” array and MUST appear in the last Catcher
                 * in the “Catch” array.'
                 *
                 * TODO: See if this rule can be enforced during validation.
                 */
                if (index === catchers.length - 1 && ErrorEquals.length === 1 && ErrorEquals[0] === 'States.ALL') {
                    return true;
                }

                return false;
            });

            if (catcher) {
                // TODO: ResultPath support.
                const { Next } = catcher;
                return advance(output, Next, states);
            }

            return Promise.reject(output);
        }

        const { StartAt, States } = spec;
        return advance(input, StartAt, States);
    }

}


module.exports = States;
