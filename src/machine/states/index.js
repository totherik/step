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

        // Not too excited about this design, but didn't get where I wanted
        // too with an OO-like design either. This allows our State
        // implementations to be pure-ish functions, while also giving some
        // structure in how filters and other common behavior is applied.
        const handler = states.get(Type);
        return new State(name, spec, handler);
    }

    run(promise) {
        const { impl, name, spec: { InputPath = '$', ResultPath = '$', OutputPath = '$' } } = this;

        return promise
            .then(data => query(data, InputPath)) // Input filter
            .then(input => impl(input).then(result => ({ name, input, result, ResultPath })))
            .then(this.applyResult) // Result filter
            .then(result => query(result, OutputPath)); // Output filter
    }

    applyResult({ name, input, result, ResultPath }) {
        // '$' is a noop since we just return result by default anyway.
        if (ResultPath && ResultPath !== '$') {
            // Using the parser to ensure the provided path is valid.
            // Then operate on the input object directly. After this
            // operation completes the structure of `input` has changed.
            const parsed = JSONPath.parse(ResultPath)
            parsed.reduce((target, path, index, paths) => {
                const { expression: { type, value }, operation, scope } = path;

                if (type == 'root') {
                    // Keep on truckin'
                    return target;
                }

                // https://states-language.net/spec.html#path
                if (type === 'identifier' && operation === 'member' && scope === 'child') {
                    if (index === paths.length - 1) {
                        // Base case. End of the road.
                        return target[value] = result;
                    }

                    // The spec reads as if we should only deal in objects. In that
                    // case we'll either 1) overwrite anything that's NOT an object
                    // with a new object, or 2) create a new object where none exists.
                    const current = target[value];
                    if (typeof current !== 'object' || Array.isArray(current)) {
                        target[value] = {};
                    }

                    return target = target[value];
                }

                throw new Error(`Invalid ResultPath for state "${name}". Provided "${ResultPath}", but ResultPath must be a Reference Path (https://states-language.net/spec.html#path).`);
            }, input);

            result = input;
        }

        return result;
    }

}


module.exports = State;
