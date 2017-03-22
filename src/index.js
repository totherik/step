const Schema = require('./schema');
const mixins = require('./states/mixins');
const Factory = require('./states/factory');
const Timeout = require('./states/mixins/timeout');


class Machine extends mixins(Timeout) {

    static create(json) {
        Schema.validate(json);

        const { States } = json;
        const factory = Factory.create(States);
        return new Machine('__root__', json, factory);
    }

    constructor(name, spec, factory) {
        super(name, spec, factory);

        const { StartAt, Version } = spec;
        this.startAt = factory.build(StartAt);
        this.version = Version;
    }

    run(input) {
        const rejected = error => {
            if (error instanceof Error) {
                const { name, stack } = error;
                error = {
                    Error: name,
                    Cause: stack,
                };
            }
            return Promise.reject(error);
        };

        const exec = this.startAt.run(input).catch(rejected);
        return this.setTimeout(exec);
    }

}


module.exports = Machine;
