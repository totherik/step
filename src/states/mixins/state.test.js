const test = require('ava');
const StateMixin = require('./state');


const State = StateMixin(class {});

test('Unimplemented', t => {

    const spec = {};
    const input = {};

    const state = new State(spec);
    return t.throws(state.run(input)).then(({ output, next }) => {
        t.is(typeof output, 'object');
        t.is(output.Error, 'Not implemented.');
        t.is(next, undefined);
    });

});
