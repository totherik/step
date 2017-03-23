const test = require('ava').only;
const Machine = require('./machine');



test('Graph', t => {

    const json = {
        StartAt: 'One',
        TimeoutSeconds: 1,
        States: {
            One: {
                Type: 'Wait',
                Seconds: 0,
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
                TimeoutSeconds: 3,
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
                                Variable: '$.abc',
                                NumericEquals: 124,
                                // Next: 'Four'
                            },
                            {
                                Variable: '$.abc',
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
            },
            Five: {
                Type: 'Parallel',
                Branches: [
                    {
                        StartAt: 'FiveOne',
                        States: {
                            FiveOne: {
                                Type: 'Wait',
                                Seconds: 0,
                                End: true
                            },
                        }
                    },
                    {
                        StartAt: 'FiveTwo',
                        States: {
                            FiveTwo: {
                                Type: 'Wait',
                                Seconds: 0,
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
                Type: 'Succeed',
            },
        },
    };

    const machine = Machine.create(json);
    const input = { SleepSeconds: [] };


    // console.log(machine.graph);
    let start = process.hrtime();
    return machine.run(input).then(() => {

        console.log('Cold start', process.hrtime(start));
        console.log(machine.stack);

        start = process.hrtime();
        return machine.run(input).then(() => {
            console.log('Warm start', process.hrtime(start));

            start = process.hrtime();
            return machine.run(input).then(() => {
                console.log('Warm start', process.hrtime(start));

                start = process.hrtime();
                return machine.run(input).then(() => {
                    console.log('Warm start', process.hrtime(start));

                    start = process.hrtime();
                    return machine.run(input).then(() => {
                        console.log('Warm start', process.hrtime(start));
                    });

                });

            });

        });

    });



});
