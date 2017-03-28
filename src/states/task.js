const mock = require('./__mocktask__');
const openwhisk = require('openwhisk');
const  { mixin, Timeout, Retry, Filter } = require('./mixins');


class Task extends mixin(Timeout, Retry, Filter) {

    constructor(spec) {
        super(spec);
        this.resource = spec.Resource;
    }

    _run(input) {
        const { resource } = this;

        if (typeof openwhisk === 'function') {
            const options = {
                name: resource,
                params: input,
                blocking: true,
                result: true,
            };

            const { actions } = openwhisk({ ignore_certs: true /* for testing */ });
            return actions.invoke(options).then(output => ({ output }));
        }

        return mock(input).then(output => ({ output }));
    }

}


module.exports = Task;
