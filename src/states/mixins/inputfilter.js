const PathUtils = require('../../pathutils');


function InputFilter(Base) {

    return class InputFilter extends Base {

        constructor(name, spec, factory) {
            super(name, spec, factory);

            const { InputPath } = spec;
            this.inputPath = InputPath;
        }

        filterInput(input) {
            const { inputPath = '$' } = this;
            /**
             * Per: https://states-language.net/spec.html#filters
             *
             * If the value of InputPath is null, that means that the raw input is
             * discarded, and the effective input for the state is an empty JSON
             * object, {}.
             */
            if (inputPath === null) {
                return {};
            }
            
            return PathUtils.query(input, inputPath);
        }

    };

}


module.exports = InputFilter;
