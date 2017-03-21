const Schema = require('./schema');
const Factory = require('./states/factory');
const mixins = require('./states/mixins/mixins');
const Timeout = require('./states/mixins/timeout');


class Machine extends mixins(Timeout) {

    static create(json) {
        Schema.validate(json);

        const { StartAt, States, Version, Comment, TimeoutSeconds } = json;
        const factory = Factory.create(States);

        const machine = new Machine();
        machine.next = factory.build(StartAt);
        machine.version = Version;
        machine.comment = Comment;

        // Initialize the Timeout mixin properties.
        machine.timeoutSeconds = TimeoutSeconds;

        return machine;
    }

    constructor() {
        super();
        this.next = undefined;
        this.version = undefined;
        this.comment = undefined;
    }

    run(input) {
        const exec = this.next
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
