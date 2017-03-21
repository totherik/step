const test = require('ava');
const Machine = require('../index');


test('Choice (StringEquals)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        Variable: '$.foo',
                        StringEquals: 'bar',
                        Next: 'Two',
                    }
                ],
                Default: 'Three',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'String does not match.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'bar' };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Choice (StringLessThan)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        Variable: '$.foo',
                        StringLessThan: 'bat',
                        Next: 'Two',
                    }
                ],
                Default: 'Three',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'String is not less.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'bar' };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Choice (StringGreaterThan)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        Variable: '$.foo',
                        StringGreaterThan: 'baa',
                        Next: 'Two',
                    }
                ],
                Default: 'Three',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'String is not greater.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'bar' };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Choice (StringLessThanEquals)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        And: [
                            {
                                Variable: '$.foo',
                                StringLessThanEquals: 'bat',
                            },
                            {
                                Variable: '$.foo',
                                StringLessThanEquals: 'bar',
                            },
                        ],
                        Next: 'Two',
                    },
                ],
                Default: 'Three',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'String is not less than or equal.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'bar' };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Choice (StringGreaterThanEquals)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        And: [
                            {
                                Variable: '$.foo',
                                StringGreaterThanEquals: 'baa',
                            },
                            {
                                Variable: '$.foo',
                                StringGreaterThanEquals: 'bar',
                            },
                        ],
                        Next: 'Two',
                    },
                ],
                Default: 'Three',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'String is not greater.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'bar' };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Choice (NumericEquals)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        Variable: '$.foo',
                        NumericEquals: 42,
                        Next: 'Two',
                    }
                ],
                Default: 'Three',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'Number does not match.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 42 };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Choice (NumericLessThan)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        Variable: '$.foo',
                        NumericLessThan: 42,
                        Next: 'Two',
                    }
                ],
                Default: 'Three',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'Number is not less.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 41 };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Choice (NumericGreaterThan)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        Variable: '$.foo',
                        NumericGreaterThan: 42,
                        Next: 'Two',
                    }
                ],
                Default: 'Three',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'Number is not greater.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 43 };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Choice (NumericLessThanEquals)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        And: [
                            {
                                Variable: '$.foo',
                                NumericLessThanEquals: 42,
                            },
                            {
                                Variable: '$.foo',
                                NumericLessThanEquals: 43,
                            },
                        ],
                        Next: 'Two',
                    },
                ],
                Default: 'Three',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'Number is not less than or equal.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 42 };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Choice (NumericGreaterThanEquals)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        And: [
                            {
                                Variable: '$.foo',
                                NumericGreaterThanEquals: 41,
                            },
                            {
                                Variable: '$.foo',
                                NumericGreaterThanEquals: 42,
                            },
                        ],
                        Next: 'Two',
                    },
                ],
                Default: 'Three',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'Number is not greater.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 42 };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Choice (BooleanEquals)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        Variable: '$.foo',
                        BooleanEquals: true,
                        Next: 'Two',
                    }
                ],
                Default: 'Three',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'Number does not match.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: true };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Choice (TimestampEquals)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        Variable: '$.foo',
                        TimestampEquals: '2017-03-21T17:22:46.707Z',
                        Next: 'Two',
                    }
                ],
                Default: 'Three',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'Number does not match.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: '2017-03-21T17:22:46.707Z' };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Choice (TimestampLessThan)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        Variable: '$.foo',
                        TimestampLessThan: '2017-03-21T17:22:46.707Z',
                        Next: 'Two',
                    }
                ],
                Default: 'Three',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'Number is not less.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: '2017-03-21T00:00:00.000Z' };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Choice (TimestampGreaterThan)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        Variable: '$.foo',
                        TimestampGreaterThan: '2017-03-21T17:22:46.707Z',
                        Next: 'Two',
                    }
                ],
                Default: 'Three',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'Number is not greater.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: '2017-03-21T18:00:00.000Z' };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Choice (TimestampLessThanEquals)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        And: [
                            {
                                Variable: '$.foo',
                                TimestampLessThanEquals: '2017-03-21T00:00:00.000Z',
                            },
                            {
                                Variable: '$.foo',
                                TimestampLessThanEquals: '2017-03-21T17:22:46.707Z',
                            },
                        ],
                        Next: 'Two',
                    },
                ],
                Default: 'Three',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'Number is not less than or equal.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: '2017-03-21T00:00:00.000Z' };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Choice (TimestampGreaterThanEquals)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        And: [
                            {
                                Variable: '$.foo',
                                TimestampGreaterThanEquals: '2017-03-21T18:00:00.000Z',
                            },
                            {
                                Variable: '$.foo',
                                TimestampGreaterThanEquals: '2017-03-21T17:22:46.707Z',
                            },
                        ],
                        Next: 'Two',
                    },
                ],
                Default: 'Three',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'Number is not greater.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: '2017-03-21T18:00:00.000Z' };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Choice (And)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        And: [
                            {
                                Variable: '$.foo',
                                StringEquals: 'bar',
                            },
                            {
                                Variable: '$.baz',
                                StringEquals: 'bam',
                            },
                        ],
                        Next: 'Two',
                    },
                ],
                Default: 'Three',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'String does not match.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = {
        foo: 'bar',
        baz: 'bam',
    };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Choice (Or)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        Or: [
                            {
                                Variable: '$.foo',
                                StringEquals: 'bar',
                            },
                            {
                                Variable: '$.baz',
                                StringEquals: 'bam',
                            },
                        ],
                        Next: 'Two',
                    }

                ],
                Default: 'Three',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'String does not match.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = { baz: 'bam' };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Choice (Not)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        Not: {
                            Variable: '$.foo',
                            StringEquals: 'bar',
                        },
                        Next: 'Two',
                    }

                ],
                Default: 'Three',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'String does not match.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'baz' };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Choice (Wrong Type)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        Variable: '$.foo',
                        StringEquals: '0',
                        Next: 'Two',
                    }
                ],
                Default: 'Three',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'String does not match.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 0 };

    return t.throws(machine.run(input)).then(output => {
        t.is(typeof output, 'object');
        t.is(output.Error, json.States.Three.Error);
        t.is(output.Cause, json.States.Three.Cause);
    });

});


test('Choice (Default)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        Variable: '$.foo',
                        StringEquals: 'baz',
                        Next: 'Two',
                    }
                ],
                Default: 'Three',
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'String does not match.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'bar' };

    return t.throws(machine.run(input)).then(output => {
        t.is(typeof output, 'object');
        t.is(output.Error, json.States.Three.Error);
        t.is(output.Cause, json.States.Three.Cause);
    });

});


test('Choice (No Default)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Choice',
                Choices: [
                    {
                        Variable: '$.foo',
                        StringEquals: 'baz',
                        Next: 'Two',
                    }
                ],
            },
            Two: {
                Type: 'Succeed',
            },
            Three: {
                Type: 'Fail',
                Error: 'String does not match.',
                Cause: 'Invalid input.'
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'bar' };

    return t.throws(machine.run(input)).then(output => {
        t.is(typeof output, 'object');
        t.is(output.Error, 'States.NoChoiceMatched');
        t.is(output.Cause, 'All Choices failed for State "One" and no Default specified.');
    });

});
