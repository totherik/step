const test = require('ava');
const Machine = require('./index');


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

    const machine = Machine.create(states);
    return machine.run(input).then(result => {
        t.deepEqual(result, { a: 'b' });
    });

});

test('Missing State definition', t => {

    const states = {
        StartAt: 'Missing',
        States: {
            Missing: {
                Type: 'Pass',
                Result: {
                    pass: {
                        a: 'b',
                    },
                },
                Next: 'DoesNotExist',
            },
        },
    };

    const machine = Machine.create(states);
    return machine.run({}).catch(err => {
        t.is(err.message, 'State "DoesNotExist" not defined.');
        return Promise.resolve({});
    });
});
