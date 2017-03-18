const test = require('ava');
const Machine = require('./index');


test('Fail', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Fail',
                Error: 'An error.',
                Cause: 'A cause.',
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'bar' };

    return t.throws(machine.run(input)).then(error => {
        const { Error, Cause } = error;
        t.deepEqual(Error, json.States.One.Error);
        t.deepEqual(Cause, json.States.One.Cause);
    });

});
