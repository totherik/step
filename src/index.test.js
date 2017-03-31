const test = require('ava');
const Machine = require('./index');


test('Graph', t => {

    const json = {
        StartAt: 'One',
        TimeoutSeconds: 1,
        States: {
            One: {
                Type: 'Wait',
                Seconds: 1,
                Next: 'Two',
            },
            Two: {
                Type: 'Pass',
                Result: {
                    'abc': 123,
                },
                ResultPath: '$.Result',
                Next: 'Seven',
            },
            Seven: {
                Type: 'Task',
                Resource: '__mockresource__',
                Next: 'Three',
                Catch: [
                    {
                        ErrorEquals: [ 'States.ALL' ],
                        Next: 'Four',
                    },
                ],
            },
            Three: {
                Type: 'Choice',
                Choices: [
                    {
                        Or: [
                            {
                                Variable: '$.abc',
                                NumericEquals: 124,
                            },
                            {
                                Variable: '$.abc',
                                NumericEquals: 123,
                            }
                        ],
                        Next: 'Five'
                    }

                ],
                Default: 'Four'
            },
            Five: {
                Type: 'Parallel',
                Branches: [
                    {
                        StartAt: 'FiveOne',
                        States: {
                            FiveOne: {
                                Type: 'Wait',
                                Seconds: 1,
                                End: true
                            },
                        }
                    },
                    {
                        StartAt: 'FiveTwo',
                        States: {
                            FiveTwo: {
                                Type: 'Pass',
                                Result: {
                                    def: 456
                                },
                                End: true
                            },
                        }
                    }
                ],
                Next: 'Eight',
            },
            Four: {
                Type: 'Fail',
                Error: 'States.Error',
                Cause: 'A cause.',
            },
            Eight: {
                Type: 'Succeed',
            },
        },
    };

    const start = Date.now();

    const input = { SleepSeconds: [ /*2, 2, 2, 2, 2*/ ] };
    const machine = Machine.create(json);
    return machine.run(input).then((output) => {
        // Should take ~2 seconds based on the Wait states.
        const duration = Date.now() - start;
        t.true(duration > 2000);
        t.true(duration < 2200);

        t.true(Array.isArray(output));
        t.is(output.length, 2);
        t.deepEqual(output[0], { abc: 123 });
        t.deepEqual(output[1], { def: 456 });
    });

});
