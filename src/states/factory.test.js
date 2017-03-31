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


// Adding this integration test for a specific error handling use-case
// involving ResultPath (since ResultPaths are evaluated after a give state
// is run)
test('ResultPath errors', t => {

    const spec = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Pass',
                Result: 10,
                ResultPath: '$.foo.length',
                End: true,
            },
        },
    };

    const input = {
        foo: 'foo',
    };

    const state = Factory.create(spec.States[spec.StartAt]);
    return t.throws(state.run(input)).then(({ output, next }) => {
        t.is(output.Error, 'States.ResultPathMatchFailure');
        t.is(next, undefined);
    });

});
