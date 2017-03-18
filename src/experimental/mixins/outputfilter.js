const PathUtils = require('../../pathutils');


function OutputFilter(Base) {

    return class OutputFilter extends Base {

        constructor(name, spec) {
            super(name, spec);
            this.outputPath = spec.OutputPath;
        }

        run(input) {
            return super.run(input)
                .then(output => this.filterOutput(output));
        }

        filterOutput(output) {
            const { outputPath = '$' } = this;
            return PathUtils.query(output, outputPath);
        }

    };

}


module.exports = OutputFilter;
