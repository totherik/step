const PathUtils = require('../../pathutils');


function InputFilter(Base) {

    return class InputFilter extends Base {

        constructor(name, spec) {
            super(name, spec);
            this.inputPath = spec.InputPath;
        }

        run(input) {
            return Promise.resolve(input)
                .then(input => this.filterInput(input))
                .then(input => super.run(input));
        }

        filterInput(input) {
            const { inputPath = '$' } = this;
            return PathUtils.query(input, inputPath);
        }

    };

}


module.exports = InputFilter;
