const test = require('ava');
const Machine = require('./index');


test('Fail', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Fail',
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'bar' };

    return t.throws(machine.run(input)).catch(output => {
        t.deepEqual(output, input);
    });

});
