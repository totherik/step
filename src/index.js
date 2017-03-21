const Schema = require('./schema');
const Factory = require('./states/factory');
const mixins = require('./states/mixins/mixins');
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

        const { StartAt, Version, Comment } = spec;
        this.startAt = factory.build(StartAt);
        this.version = Version;
        this.comment = Comment;
    }

    run(input) {
        const exec = this.startAt
            .run(input)
            .catch(error => {
                if (error instanceof Error) {
                    // Normalize errors.
                    // TODO: May lose stack trace informations here,
                    // so come up with a better plan.
                    const { name, message } = error;
                    error = {
                        Error: error.name,
                        Cause: error.message,
                    };
                }
                return Promise.reject(error);
            });

        return this.setTimeout(exec);
    }

}


module.exports = Machine;
