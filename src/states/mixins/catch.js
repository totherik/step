const { match, toErrorOutput } = require('./errorutils');


function Catch(Base) {

    return class Catch extends Base {

        constructor(spec) {
            super(spec);
            this.catchers = spec.Catch || [];
            this.resultPath = spec.ResultPath;
        }

        run(input) {
            return super.run(input).catch(error => this.catch(error));
        }

        catch(error) {

            // TODO: The Catch type must support ResultPath.
            let output = toErrorOutput(error);
            const catcher = match(this.catchers, output.Error);
            if (catcher) {
                return {
                    output,
                    next: catcher.Next,
                };
            }

            // WARN: Wrapped was possibly a type that cannot me mapped to Error/Cause.
            // Reject with the original error.
            return Promise.reject(error);
        }

    };

}


module.exports = Catch;
