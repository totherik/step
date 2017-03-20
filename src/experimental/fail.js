const State = require('./mixins/state');
const mixins = require('./mixins/mixins');


class Fail extends mixins(State) {

    static create(name, spec/*, factory*/) {
        const { Error, Cause } = spec;

        const fail = new Fail(name, spec);
        fail.error = Error;
        fail.cause = Cause;
        return fail;
    }

    constructor(name, spec) {
        super(name, spec);
        this.error = undefined;
        this.cause = undefined;
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
