const test = require('ava');
const { Machine } = require('./index');

test('Pass', t => {

    const states = {
        StartAt: 'PassTest',
        States: {
            PassTest: {
                Type: 'Pass',
                InputPath: '$.foo',
                ResultPath: '$.bar',
                OutputPath: '$.bar.pass',
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
        foo: {
            bar: 'bar',
        },
    };

    const machine = new Machine(states);
    return machine.run(input).then(result => {
        t.deepEqual(result, { a: 'b' });
    });

});
