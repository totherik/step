const { run } = require('../');


function Parallel(name, spec, input) {
    const { Branches } = spec;
    const machines = Branches.map(run.bind(null, input));
    return Promise.all(machines);
}

module.exports = Parallel;
