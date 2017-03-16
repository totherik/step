const test = require('ava');
const Machine = require('./index');


test('String Type', t => {

    const json = {
        StartAt: 'First',
        States: {
            First: {
                Type: 'Pass',
                End: true,
            },
        },
    };

    const input = 'hello';
    const machine = Machine.create(json);
    return machine.run(input).then(output => {
        t.is(output, input);
    });

});


test('Number Type', t => {

    const json = {
        StartAt: 'First',
        States: {
            First: {
                Type: 'Pass',
                End: true,
            },
        },
    };

    const input = 42;
    const machine = Machine.create(json);
    return machine.run(input).then(output => {
        t.is(output, input);
    });

});


test('Array Type', t => {

    const json = {
        StartAt: 'First',
        States: {
            First: {
                Type: 'Pass',
                End: true,
            },
        },
    };

    const input = [ 'test' ];
    const machine = Machine.create(json);
    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Boolean Type', t => {

    const json = {
        StartAt: 'First',
        States: {
            First: {
                Type: 'Pass',
                End: true,
            },
        },
    };

    const input = true;
    const machine = Machine.create(json);
    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Undefined Input', t => {

    const json = {
        StartAt: 'First',
        States: {
            First: {
                Type: 'Pass',
                End: true,
            },
        },
    };

    const input = undefined;
    const machine = Machine.create(json);
    return machine.run(input).then(output => {
        t.is(typeof output, 'object');
    });

});


test('Null Input', t => {

    const json = {
        StartAt: 'First',
        States: {
            First: {
                Type: 'Pass',
                End: true,
            },
        },
    };

    const input = null;
    const machine = Machine.create(json);
    return machine.run(input).then(output => {
        t.is(typeof output, 'object');
    });

});


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
