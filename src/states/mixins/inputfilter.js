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
            return PathUtils.query(input, inputPath);
        }

    };

}


module.exports = InputFilter;
