const  { mixin } = require('./mixins');


class Fail extends mixin(/* State */) {

    constructor(spec) {
        super(spec);
        this.error = spec.Error;
        this.cause = spec.Cause;
    }

    _run(input) {
        // TODO: Do we always use the configured Error and Cause, or pass
        // through error source details?
        const { error, cause } = this;
        const result = Object.assign({ Error: error, Cause: cause }, input);
        return Promise.reject(result);
    }

}


module.exports = Fail;
