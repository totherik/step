const test = require('ava');
const Machine = require('../index');


test('Parallel', t => {

    const then = Date.now();
    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Parallel',
                Branches: [
                    {
                        StartAt: 'One',
                        States: {
                            One: {
                                Type: 'Wait',
                                Seconds: 2,
                                Next: 'Two',
                            },
                            Two: {
                                Type: 'Pass',
                                Result: {
                                    one: 'a',
                                },
                                End: true,
                            },
                        },
                    },
                    {
                        StartAt: 'One',
                        States: {
                            One: {
                                Type: 'Wait',
                                Seconds: 2,
                                Next: 'Two',
                            },
                            Two: {
                                Type: 'Pass',
                                Result: {
                                    one: 'b'
                                },
                                End: true,
                            },
                        },
                    },
                ],
                End: true,
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'bar' };

    return machine.run(input).then(output => {
        // Since this is parallel, try to ensure that given the same Wait
        // duration, the test executes in the time of one Branch, not two.
        // Also, add 100ms padding to limit for variance.
        const now = Date.now();
        const duration = now - then;
        const limit = (json.States.One.Branches[0].States.One.Seconds * 1000) + 100;
        t.true(duration < limit);

        t.true(Array.isArray(output));
        t.is(output.length, 2);
        t.deepEqual(output[0], json.States.One.Branches[0].States.Two.Result);
        t.deepEqual(output[1], json.States.One.Branches[1].States.Two.Result);
    });

});
