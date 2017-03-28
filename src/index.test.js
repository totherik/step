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
                Resource: 'step_test_action',
                TimeoutSeconds: 1,
                Retry: [
                    {
                        ErrorEquals: [ 'States.Timeout' ],
                        MaxAttempts: 2,
                    }
                ],
                Catch: [
                    {
                        ErrorEquals: [ 'States.Timeout' ],
                        Next: 'Four'
                    },
                    {
                        ErrorEquals: [ 'States.ALL' ],
                        Next: 'Six'
                    }
                ],
                Next: 'Three',
            },
            Three: {
                Type: 'Choice',
                Choices: [
                    {
                        Or: [
                            {
                                Variable: '$.Result.abc',
                                NumericEquals: 124,
                                // Next: 'Four'
                            },
                            {
                                Variable: '$.Result.abc',
                                NumericEquals: 123,
                                // Next: 'Five'
                            }
                        ],
                        Next: 'Five'
                    }

                ],
                Default: 'Six'
            },
            Four: {
                Type: 'Fail',
                Error: 'States.Error',
                Cause: 'A cause.',
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
                                Type: 'Wait',
                                Seconds: 1,
                                End: true
                            },
                        }
                    }
                ],
                Catch: [
                ],
                Next: 'Six',
            },
            Six: {
                Type: 'Pass',
                // InputPath: '$[0]',
                Result: 'bar',
                ResultPath: '$.foo',
                Next: 'Eight',
            },
            Eight: {
                Type: 'Succeed',
            },
        },
    };

    const input = { SleepSeconds: [ /*2, 2, 2, 2, 2*/ ] };
    const machine = Machine.create(json);
    return machine.run(input);

});
