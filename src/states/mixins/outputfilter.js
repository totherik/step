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
            return PathUtils.query(output, outputPath);
        }

    };

}


module.exports = OutputFilter;
