const Pass = require('./pass');
const Task = require('./task');
const Wait = require('./wait');
const Fail = require('./fail');
const Choice = require('./choice');
const Succeed = require('./succeed');
const Parallel = require('./parallel');


const StateTypes = new Map([
    [ 'Pass', Pass ],
    [ 'Task', Task ],
    [ 'Wait', Wait ],
    [ 'Fail', Fail ],
    [ 'Choice', Choice ],
    [ 'Succeed', Succeed ],
    [ 'Parallel', Parallel ],
]);


const cache = new Map();


class Factory {

    static create(spec, Machine) {
        if (cache.has(spec)) {
            return cache.get(spec);
        }


        // Pass Machine to States that need to build sub-state machines
        // (really just Parallel). This is done to avoid a circular dependency
        // between Machine <-> Parallel.
        // TODO: Look for a better way to avoid circular dependencies.
        const State = StateTypes.get(spec.Type);
        const state = new State(spec, Machine);
        cache.set(spec, state);
        return state;
    }

}

module.exports = Factory;
