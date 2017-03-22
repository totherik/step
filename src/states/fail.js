const mixins = require('./mixins');


class Fail extends mixins() {

    constructor(name, spec, factory) {
        super(name, spec, factory);

        const { Error, Cause } = spec;
        this.error = Error;
        this.cause = Cause;
    }

    _run(input) {
        const { error, cause } = this;
        return Promise.reject({
            Error: error,
            Cause: cause,
        });
    }

}


module.exports = Fail;
