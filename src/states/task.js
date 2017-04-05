const mock = require('./__mocktask__');
const openwhisk = require('openwhisk');
const  { mixin, Timeout, Retry, Catch, Filter } = require('./mixins');


class Task extends mixin(Timeout, Filter, Retry, Catch) {

    constructor(spec) {
        super(spec);
        this.resource = spec.Resource;
    }

    _run(input) {
        const { resource } = this;

        if (resource === '__mockresource__') {
            return mock(input).then(output => ({ output }));
        }

        if (process.env['__OW_API_KEY'] && process.env['__OW_API_HOST'] && typeof openwhisk === 'function') {
            const options = {
                name: resource,
                params: input,
                blocking: true,
            };

            const resolve = output => ({ output });
            const reject = ({ error }) => {
                const output = {
                    Error: 'States.TaskFailed',
                    Cause: JSON.stringify(error),
                };
                return Promise.reject(output);
            };

            const { actions } = openwhisk({ ignore_certs: true /* for testing */ });
            return actions.invoke(options).then(resolve, reject);
        }

        return Promise.reject(new Error(`No task implementation provided to execute resource ${resource}.`));
    }

}


module.exports = Task;
