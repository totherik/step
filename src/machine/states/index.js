const JSONPath = require('jsonpath');
const { query } = require('../../utils');


const states = new Map([
    [ 'Pass',     require('./pass') ],
    [ 'Task',     require('./task') ],
    [ 'Choice',   require('./choice') ],
    [ 'Wait',     require('./wait') ],
    [ 'Succeed',  require('./succeed') ],
    [ 'Fail',     require('./fail') ],
    [ 'Parallel', require('./parallel') ],
]);


class State {

    constructor(name, spec, impl) {
        this.name = name;
        this.spec = spec;
        this.impl = impl.bind(null, name, spec);
    }

    static create(name, spec) {
        const { Type } = spec;

        if (!states.has(Type)) {
            throw new Error(`Type ${Type} not supported.`);
        }

        /**
         * Not too excited about this design, but didn't get where I wanted
         * too with an OO-like design either. This allows our State
         * implementations to be pure-ish functions, while also giving some
         * structure in how filters and other common behavior is applied.
         */
        const handler = states.get(Type);
        return new State(name, spec, handler);
    }

    run(promise) {
        const { name, spec, impl } = this;
        const { InputPath = '$', ResultPath = '$', OutputPath = '$' } = spec;

        return promise
            .then(data => query(data, InputPath)) // Input filter
            .then(input => impl(input).then(result => ({ name, input, result, ResultPath })))
            .then(this.applyResult) // Result filter
            .then(result => query(result, OutputPath)); // Output filter
    }

    applyResult({ name, input, result, ResultPath }) {
        // No mapping or merging of data necessary.
        if (ResultPath === undefined) {
            return result;
        }

        /**
         * Per: https://states-language.net/spec.html#filters
         *
         * "If the value of of ResultPath is null, that means that the
         * state’s own raw output is discarded and its raw input becomes
         * its result."
         */
        if (ResultPath === null) {
            return input;
        }

        /**
         * The root path, '$', is basically a noop since we just return
         * result by default anyway, so short-circuit.
         */
        if (ResultPath === '$') {
            return result;
        }

        /**
         * Per: https://states-language.net/spec.html#filters
         *
         * "The ResultPath field’s value is a Reference Path that specifies
         * where to place the result, relative to the raw input. If the input
         * has a field which matches the ResultPath value, then in the output,
         * that field is discarded and overwritten by the state output.
         * Otherwise, a new field is created in the state output."
         *
         * Using the parser to ensure the provided path is valid. Then
         * operate on the input object directly. After this operation
         * completes the structure of `input` has changed.
         */
        const parsed = JSONPath.parse(ResultPath)
        parsed.reduce((target, path, index, paths) => {
            const { expression: { type, value }, operation, scope } = path;

            if (type == 'root') {
                // Keep on truckin'
                return target;
            }

            /**
             * Per: https://states-language.net/spec.html#filters
             *      https://states-language.net/spec.html#path
             *
             * "The value of “ResultPath” MUST be a Reference Path, which
             * specifies the combination with or replacement of the state’s
             * result with its raw input."
             */
            if (type === 'identifier' && operation === 'member' && scope === 'child') {
                if (index === paths.length - 1) {
                    // Base case. End of the road.
                    return target[value] = result;
                }

                /**
                 * The spec reads as if we should only deal in objects.
                 * In that case we'll either 1) overwrite anything that's
                 * NOT an object with a new object, or 2) create a new
                 * object where none exists.
                 */
                const current = target[value];
                if (typeof current !== 'object' || Array.isArray(current)) {
                    target[value] = {};
                }

                return target = target[value];
            }

            throw new Error(`Invalid ResultPath for state "${name}". Provided "${ResultPath}", but ResultPath must be a Reference Path (https://states-language.net/spec.html#path).`);
        }, input);

        return input;
    }

}


module.exports = State;
