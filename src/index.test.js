const test = require('ava');
const { Machine } = require('./index');

test('Pass', t => {

    const states = {
        StartAt: 'PassTest',
        States: {
            PassTest: {
                Type: 'Pass',
                Result: {
                    pass: {
                        a: 'b',
                    },
                },
                End: true,
            },
        },
    };

    const input = {
        foo: 'bar',
    };

    const machine = new Machine(states);
    return machine.run(input).then(result => {
        t.deepEqual(result, { pass: { a: 'b' } });
    });

});
