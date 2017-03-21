const Factory = require('./factory');
const Schema = require('./schema');


class Machine {

    static create(json) {
        Schema.validate(json);

        const { StartAt, States, Version, Comment, TimeoutSeconds } = json;
        const factory = Factory.create(States);

        const machine = new Machine();
        machine.next = factory.build(StartAt);
        machine.version = Version;
        machine.comment = Comment;
        machine.timeoutSeconds = TimeoutSeconds;
        return machine;
    }

    constructor() {
        this.next = undefined;
        this.version = undefined;
        this.comment = undefined;
        this.timeoutSeconds = undefined;
    }

    run(input) {
        // TODO: Implement timeout.
        return this.next
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
    }
}


module.exports = Machine;
