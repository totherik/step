const { query } = require('../../utils');
const JSONPath = require('jsonpath');



/**
 * Applies InputPath and OutputPath (and optionally ResultPath) JSONPaths
 * to input, output and results, respectively.
 * https://states-language.net/spec.html#filters
 */
function all(name, spec, fn) {
    return input(name, spec, output(name, spec, result(name, spec, fn)));
}

function input(name, spec, fn) {
    return function (raw) {
        const { InputPath = '$' } = spec;

        console.log(name, spec);
        console.log(name, 'Input', raw);

        const input = query(raw, InputPath);
        return fn(input);
    };
}

function output(name, spec, fn) {
    return function (raw) {
        const { OutputPath = '$' } = spec;
        return fn(raw)
            .then(output => {
                const val = query(output, OutputPath);
                console.log(name, 'Output', val);
                return val;
            });
    };
}

function result(name, spec, fn) {
    return function (input) {
        const { ResultPath } = spec;
        return fn(input)
            .then(result => {

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
            });
    };
}

module.exports = {
    all,
    input,
    output,
    result,
};
