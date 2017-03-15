const States = require('./');


function Parallel(name, spec, input) {
    const { Branches } = spec;
    const machines = Branches.map(branch => {
        // The overall State Machine spec was already validated, so we can
        // skip the validation step when running Branches.
        return States.run(input, branch);
    });
    return Promise.all(machines);
}

module.exports = Parallel;
