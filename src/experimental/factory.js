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
    [ 'Choice', Choice ],
    [ 'Wait', Wait ],
    [ 'Succeed', Succeed ],
    [ 'Fail', Fail ],
    [ 'Parallel', Parallel ],
]);


const caches = new Map();


class Factory {

    static create(states) {
        return new Factory(states);
    }

    constructor(States) {
        this.states = States;
        caches.set(this, new Map());
    }

    build(name) {
        const cache = caches.get(this);
        if (cache.has(name)) {
            return cache.get(name);
        }

        const { states } = this;
        if (states.hasOwnProperty(name)) {
            const spec = states[name];
            const State = StateTypes.get(spec.Type);
            const state = State.create(name, spec, this);
            cache.set(name, state);
            return state;
        }

        return undefined;
    }

}


module.exports = Factory;
