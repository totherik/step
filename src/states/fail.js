const  { mixin } = require('./mixins');


class Fail extends mixin(/* State */) {

    constructor(spec) {
        super(spec);
        this.error = spec.Error;
        this.cause = spec.Cause;
    }

    _run(input) {
        const { error, cause } = this;
        return Promise.reject({ Error: error, Cause: cause });
    }

}


module.exports = Fail;
