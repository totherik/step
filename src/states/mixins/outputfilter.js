const PathUtils = require('../../pathutils');


function OutputFilter(Base) {

    return class OutputFilter extends Base {

        constructor(name, spec, factory) {
            super(name, spec, factory);

            const { OutputPath } = spec;
            this.outputPath = OutputPath;
        }

        filterOutput(output) {
            const { outputPath = '$' } = this;

            /**
             * Per: https://states-language.net/spec.html#filters
             *
             * If the value of OutputPath is null, that means the input and result
             * are discarded, and the effective output from the state is an empty
             * JSON object, {}.
             */
            if (outputPath === null) {
                return {};
            }

            return PathUtils.query(output, outputPath);
        }

    };

}


module.exports = OutputFilter;
