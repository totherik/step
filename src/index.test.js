const test = require('ava');
const Machine = require('./index');


test('Machine (Timeout)', t => {

    const json = {
        StartAt: 'One',
        TimeoutSeconds: 1,
        States: {
            One: {
                Type: 'Wait',
                Seconds: 3,
                Next: 'Two',
            },
            Two: {
                Type: 'Succeed'
            },
        },
    };

    const machine = Machine.create(json);
    const input = {};

    t.throws(machine.run(input)).then(output => {
        t.is(typeof output, 'object');
        t.is(output.Error, 'States.Timeout');
    });

});
