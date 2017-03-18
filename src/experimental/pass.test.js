const test = require('ava');
const Machine = require('./index');


test('Pass', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Pass',
                End: true,
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'bar' };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});
