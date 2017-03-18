const Factory = require('./factory');


class Machine {

    static create(json) {
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
        return this.next.run(input);
    }
}


module.exports = Machine;
