const JSONPath = require('jsonpath');
const { query } = require('../../utils');


class State {

    constructor(name, spec, impl) {
        this.name = name;
        this.spec = spec;
        this.impl = impl.bind(null, name, spec);
    }

    filterInput() {
        const { name, spec: { InputPath = '$' } } = this;
        return function (raw) {
            console.log(name, spec);
            console.log(name, 'Input', raw);
            return query(raw, InputPath);
        };
    }

    filterResult(input) {
        const { name, spec: { ResultPath } } = this;

        return function (result) {

            console.log(name, 'Raw Result', result);

            if (ResultPath) {
                // '$' is a noop, so will just replace result with
                // input later.
                if (ResultPath !== '$') {
                    // Using the parser to ensure the provided path is valid.
                    // Then operate on the input object directly. After this
                    // operation completes the structure of `input` has changed.
                    JSONPath.parse(ResultPath).reduce((target, path, index, paths) => {
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

                        throw new Error('Invalid ResultPath.');
                    }, input);
                }

                result = input;
            }

            console.log(name, 'Merged Result', result);
            return result;
        };
    }

    filterOutput() {
        const { name, spec: { OutputPath = '$' } } = this;
        return function (result) {
            const output = query(result, OutputPath);
            console.log(name, 'Output', output);
            return output;
        };
    }

    run(promise) {
        return promise.then(input => {
            const filtered = this.filterInput(input);
            return this
                .impl(filtered)
                .then(this.filterResult(filtered))
                .then(this.filterOutput())
        });
    }

}


module.exports = State;
