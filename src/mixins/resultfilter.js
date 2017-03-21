const PathUtils = require('../pathutils');


function ResultFilter(Base) {

    return class ResultFilter extends Base {

        constructor(name, spec) {
            super(name, spec);
            this.resultPath = spec.ResultPath;
        }

        run(input) {
            return super.run(input)
                .then(result => this.filterResult(input, result));
        }

        filterResult(input, result) {
            const { name, resultPath } = this;

            // No mapping or merging of data necessary.
            if (resultPath === undefined) {
                return result;
            }

            /**
             * Per: https://states-language.net/spec.html#filters
             *
             * "If the value of of ResultPath is null, that means that the
             * state’s own raw output is discarded and its raw input becomes
             * its result."
             */
            if (resultPath === null) {
                return input;
            }

            /**
             * The root path, '$', is basically a noop since we just return
             * result by default anyway, so short-circuit.
             */
            if (resultPath === '$') {
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
            const parsed = PathUtils.parse(resultPath)
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
                     * @see Runtime Errors - https://states-language.net/spec.html
                     *
                     * "Suppose a state’s input is the string 'foo', and its
                     * 'ResultPath' field has the value '$.x'. Then ResultPath
                     * cannot apply and the Interpreter fails the machine with
                     * Error Name of 'States.OutputMatchFailure'."
                     *
                     * If I'm reading this correctly, due to the constraints
                     * of Reference Paths, if the ResultPath can't resolve to
                     * a single property on an object (non-primitive) type,
                     * it must fail.
                     *
                     * This code takes the most literal interpretation and
                     * only allows object type operations, excluding Array
                     * indicies, etc. This constraint can be relaxed in the
                     * future, if necessary.
                     */
                    const child = target[value];
                    if (typeof child !== 'object' || Array.isArray(child)) {
                        const error = new Error(`Unable to match ResultPath "${ResultPath}".`);
                        error.name = 'States.ResultPathMatchFailure';
                        throw error;
                    }


                    if (typeof child === undefined) {
                        child = target[value] = {};
                    }

                    return target = child;
                }

                const error = new Error(`Invalid ResultPath for state "${name}". Provided "${resultPath}", but ResultPath must be a Reference Path (https://states-language.net/spec.html#path).`);
                error.name = 'States.ResultPathMatchFailure';
                throw error;

            }, input);

            return input;
        }

    };

}


module.exports = ResultFilter;
