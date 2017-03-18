const test = require('ava');
const Machine = require('./index');


test('Task', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Task',
                Resource: 'foo',
                End: true,
            },
        },
    };

    const machine = Machine.create(json);
    const input = {
        Result: {
            foo: 'bar',
        },
    };

    return machine.run(input).then(output => {
        t.deepEqual(output, input.Result);
    });

});


test('ResultPath (existing property)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Task',
                Resource: 'foo',
                ResultPath: '$.target',
                End: true,
            },
        },
    };

    const machine = Machine.create(json);
    const input = {
        target: 'target',
        Result: {
            foo: 'bar',
        },
    };

    return machine.run(input).then(output => {
        t.is(output.target.foo, 'bar');
        t.deepEqual(output.Result, input.Result);
        t.deepEqual(output.target, output.Result);
    });

});


test('ResultPath (new property)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Task',
                Resource: 'foo',
                ResultPath: '$.target',
                End: true,
            },
        },
    };

    const machine = Machine.create(json);
    const input = {
        Result: {
            foo: 'bar',
        },
    };

    return machine.run(input).then(output => {
        t.is(output.target.foo, 'bar');
        t.deepEqual(output.Result, input.Result);
        t.deepEqual(output.target, output.Result);
    });

});


test('ResultPath (non-Reference path)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Task',
                Resource: 'foo',
                ResultPath: '$.*',
                End: true,
            },
        },
    };

    const machine = Machine.create(json);
    const input = {
        Result: {
            foo: 'bar',
        },
    };

    return t.throws(machine.run(input)).then(error => {
        const { Error, Cause } = error;
        t.is(Error, 'States.ResultPathMatchFailure');
        t.is(Cause, 'Invalid ResultPath for state "One". Provided "$.*", but ResultPath must be a Reference Path (https://states-language.net/spec.html#path).');
    });

});


test('InputPath', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Task',
                Resource: 'foo',
                InputPath: '$.nested',
                End: true,
            },
        },
    };

    const machine = Machine.create(json);
    const input = {
        nested: {
            Result: {
                foo: 'bar',
            },
        },
    };

    return machine.run(input).then(output => {
        t.is(output.foo, 'bar');
    });

});


test('InputPath null', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Task',
                Resource: 'foo',
                InputPath: null,
                End: true,
            },
        },
    };

    const machine = Machine.create(json);
    const input = {
        nested: {
            Result: {
                foo: 'bar',
            },
        },
    };

    return machine.run(input).then(output => {
        // Input is new object, so our expected `Result` is not defined.
        t.is(output, undefined);
        t.notDeepEqual(input, output);
    });

});


test('OutputPath', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Task',
                Resource: 'foo',
                OutputPath: '$.foo',
                End: true,
            },
        },
    };

    const machine = Machine.create(json);
    const input = {
        Result: {
            foo: 'bar',
        },
    };

    return machine.run(input).then(output => {
        t.is(output, 'bar');
    });

});


test('OutputPath null', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Task',
                Resource: 'foo',
                OutputPath: null,
                End: true,
            },
        },
    };

    const machine = Machine.create(json);
    const input = {
        Result: {
            foo: 'bar',
        },
    };

    return machine.run(input).then(output => {
        t.is(typeof output, 'object');
        t.notDeepEqual(input, output);
    });

});


test('Catch', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Task',
                Resource: 'test',
                TimeoutSeconds: 1,
                Catch: [{
                    ErrorEquals: [ 'States.ALL' ],
                    Next: 'Three',
                }],
                Next: 'Two',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'Broken',
                Cause: 'Unknown'
            }
        },
    };

    const machine = Machine.create(json);
    const input = {
        SleepSeconds: [ 2 ]
    };

    return t.throws(machine.run(input)).then(({ Error, Cause }) => {
        t.is(Error, 'Broken');
        t.is(Cause, 'Unknown');
    });

});


test('Retry', t => {

    const json = {
        StartAt: 'Error',
        States: {
            Error: {
                Type: 'Task',
                Resource: 'test',
                TimeoutSeconds: 1,
                Retry: [
                    {
                        ErrorEquals: [ 'States.Timeout'],
                    },
                    {
                        ErrorEquals: [ 'States.ALL' ],
                        MaxAttempts: 0,
                    }
                ],
                End: true,
            },
        },
    };

    const machine = Machine.create(json);
    const input = {
        SleepSeconds: [ 2, 2, 2, 2 ],
    };

    return t.throws(machine.run(input)).then(error => {
        const { Error, Cause } = error;
        t.is(Error, 'States.Timeout');
        t.is(Cause, 'Request timeout.');
    });

});
