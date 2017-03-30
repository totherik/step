const test = require('ava');
const Factory = require('./factory');


test('create', t => {

    const spec = {
        Type: 'Succeed'
    };

    const state = Factory.create(spec);
    t.is(typeof state, 'object');
    t.is(state.constructor.name, spec.Type);

});


test('cache', t => {

    const spec = {
        Type: 'Succeed'
    };

    const state = Factory.create(spec);
    t.is(typeof state, 'object');

    const state2 = Factory.create(spec);
    t.is(typeof state2, 'object');

    t.true(state === state2);

});
