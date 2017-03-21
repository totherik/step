const Schema = require('./schema');
const Factory = require('./states/factory');


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

        return this.setTimeout(exec, this.timeoutSeconds);
    }

    setTimeout(promise) {
        const { timeoutSeconds } = this;

        if (isNaN(timeoutSeconds)) {
            return promise;
        }

        return new Promise((resolve, reject) => {

            // Once a promise is settled, additional calls to resolve/reject are a noop.
            const timer = setTimeout(reject, timeoutSeconds * 1000, { Error: 'States.Timeout' });

            promise
                .then((result) => {
                    clearTimeout(timer);
                    resolve(result);
                })
                .catch(error => {
                    clearTimeout(timer);
                    reject(error);
                });

        });
    }

}


module.exports = Machine;
