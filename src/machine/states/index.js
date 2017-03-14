const State = require('./state');
const pass = require('./pass');
const task = require('./task');
const choice = require('./choice');
const wait = require('./wait');
const succeed = require('./succeed');
const fail = require('./fail');
const parallel = require('./parallel');


const states = new Map([
    ['Pass', pass],
    ['Task', task],
    ['Choice', choice],
    ['Wait', wait],
    ['Succeed', succeed],
    ['Fail', fail],
    ['Parallel', parallel],
]);


function get(name, spec) {
    const { Type } = spec;

    if (!states.has(Type)) {
        throw new Error(`Type ${Type} not supported.`);
    }

    // https://states-language.net/spec.html#filters
    const handler = states.get(Type);
    return new State(name, spec, handler);
}

module.exports = {
    get,
};
