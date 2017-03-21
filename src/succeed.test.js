const test = require('ava');
const Machine = require('./index');


test('Succeed', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Succeed',
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'bar' };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});
