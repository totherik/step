const test = require('ava');
const StateMixin = require('./state');


const State = StateMixin(class {});

test('Unimplemented', t => {

    const spec = {};
    const input = {};

    const state = new State(spec);
    return t.throws(state.run(input)).then(error => {
        t.is(typeof error, 'object');
        t.is(error.Error, 'Not implemented.');
    });

});
