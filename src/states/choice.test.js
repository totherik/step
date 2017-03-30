const test = require('ava');
const Choice = require('./choice');


test('Default', t => {

    const spec = {
        Choices: [
            {
                Variable: '$',
                StringEquals: 'bar',
                Next: 'StringEquals',
            }
        ],
        Default:  'Default',
    };

    const input = 'baz';

    const choice = new Choice(spec);
    return choice.run(input).then(({ output, next }) => {
        t.deepEqual(input, output);
        t.is(next, spec.Default);
    });

});


test('No Choices', t => {

    const spec = {
        Default:  'Default',
    };

    const input = 'baz';

    const choice = new Choice(spec);
    return choice.run(input).then(({ output, next }) => {
        t.deepEqual(input, output);
        t.is(next, spec.Default);
    });

});


test('No Variable', t => {

    const spec = {
        Choices: [
            {
                // Variable: '$', // Use default
                StringEquals: 'bar',
                Next: 'StringEquals',
            }
        ],
        Default:  'Default',
    };

    const input = 'bar';

    const choice = new Choice(spec);
    return choice.run(input).then(({ output, next }) => {
        t.deepEqual(input, output);
        t.is(next, spec.Choices[0].Next);
    });

});


test('String', t => {

    const operators = [
        { operator: 'StringEquals', value: 'bar' },
        { operator: 'StringLessThan', value: 'cat' },
        { operator: 'StringGreaterThan', value: 'ant' },
        { operator: 'StringLessThanEquals', value: 'bat' },
        { operator: 'StringGreaterThanEquals', value: 'ban' },
    ];

    const tests = operators.map(({ operator, value }) => {
        const spec = {
            Choices: [
                {
                    Variable: '$',
                    [operator]: value,
                    Next: operator,
                }
            ],
            Default:  'Default',
        };

        const input = 'bar';

        const choice = new Choice(spec);
        return choice.run(input).then(({ output, next }) => {
            t.deepEqual(input, output);
            t.is(next, spec.Choices[0].Next);
        });
    });

    return Promise.all(tests);

});


test('Numeric', t => {

    const operators = [
        { operator: 'NumericEquals', value: 42 },
        { operator: 'NumericLessThan', value: 43 },
        { operator: 'NumericGreaterThan', value: 41 },
        { operator: 'NumericLessThanEquals', value: 42 },
        { operator: 'NumericGreaterThanEquals', value: 41 },
    ];

    const tests = operators.map(({ operator, value }) => {
        const spec = {
            Choices: [
                {
                    Variable: '$',
                    [operator]: value,
                    Next: operator,
                }
            ],
            Default:  'Default',
        };

        const input = 42;

        const choice = new Choice(spec);
        return choice.run(input).then(({ output, next }) => {
            t.deepEqual(input, output);
            t.is(next, spec.Choices[0].Next);
        });
    });

    return Promise.all(tests);

});


test('Boolean', t => {

    const operators = [
        { operator: 'BooleanEquals', value: true },
    ];

    const tests = operators.map(({ operator, value }) => {
        const spec = {
            Choices: [
                {
                    Variable: '$',
                    [operator]: value,
                    Next: operator,
                }
            ],
            Default:  'Default',
        };

        const input = true;

        const choice = new Choice(spec);
        return choice.run(input).then(({ output, next }) => {
            t.deepEqual(input, output);
            t.is(next, spec.Choices[0].Next);
        });
    });

    return Promise.all(tests);

});


test('Timestamp', t => {

    const now = Date.now();

    const operators = [
        { operator: 'TimestampEquals', value: new Date(now).toISOString() },
        { operator: 'TimestampLessThan', value: new Date(now + 1000).toISOString() },
        { operator: 'TimestampGreaterThan', value: new Date(now - 1000).toISOString() },
        { operator: 'TimestampLessThanEquals', value: new Date(now + 1000).toISOString() },
        { operator: 'TimestampGreaterThanEquals', value: new Date(now).toISOString() },
    ];

    const tests = operators.map(({ operator, value }) => {
        const spec = {
            Choices: [
                {
                    Variable: '$',
                    [operator]: value,
                    Next: operator,
                }
            ],
            Default:  'Default',
        };

        const input = new Date(now).toISOString();

        const choice = new Choice(spec);
        return choice.run(input).then(({ output, next }) => {
            t.deepEqual(input, output);
            t.is(next, spec.Choices[0].Next);
        });
    });

    return Promise.all(tests);

});


test('No operator', t => {

    const spec = {
        Choices: [
            {
                // And: [],
                Next: 'Next'
            }
        ],
        Default: 'Default',
    };

    const input = 50;

    const choice = new Choice(spec);
    return choice.run(input).then(({ output, next}) => {
        t.deepEqual(input, output);
        t.is(next, spec.Default);
    });

});


test('And', t => {

    const spec = {
        Choices: [
            {
                And: [
                    {
                        Variable: '$',
                        NumericGreaterThan: 0,
                    },
                    {
                        Variable: '$',
                        NumericLessThan: 100,
                    }
                ],
                Next: 'Next'
            }
        ],
        Default: 'Default',
    };

    const input = 50;

    const choice = new Choice(spec);
    return choice.run(input).then(({ output, next}) => {
        t.deepEqual(input, output);
        t.is(next, spec.Choices[0].Next);
    });

});


test('Undefined And', t => {

    const spec = {
        Choices: [
            {
                And: undefined,
                Next: 'Next'
            }
        ],
        Default: 'Default',
    };

    const input = 50;

    const choice = new Choice(spec);
    return choice.run(input).then(({ output, next}) => {
        t.deepEqual(input, output);
        t.is(next, spec.Choices[0].Next);
    });

});


test('Or', t => {

    const spec = {
        Choices: [
            {
                Or: [
                    {
                        Variable: '$',
                        NumericGreaterThan: 100,
                    },
                    {
                        Variable: '$',
                        NumericLessThan: 99,
                    }
                ],
                Next: 'Next'
            }
        ],
        Default: 'Default',
    };

    const input = 50;

    const choice = new Choice(spec);
    return choice.run(input).then(({ output, next}) => {
        t.deepEqual(input, output);
        t.is(next, spec.Choices[0].Next);
    });

});


test('Undefined Or', t => {

    const spec = {
        Choices: [
            {
                Or: undefined,
                Next: 'Next'
            }
        ],
        Default: 'Default',
    };

    const input = 50;

    const choice = new Choice(spec);
    return choice.run(input).then(({ output, next}) => {
        t.deepEqual(input, output);
        t.is(next, spec.Default);
    });

});


test('Not', t => {

    const spec = {
        Choices: [
            {
                Not: {
                    Variable: '$',
                    NumericGreaterThan: 50,
                },
                Next: 'Next'
            }
        ],
        Default: 'Default',
    };

    const input = 50;

    const choice = new Choice(spec);
    return choice.run(input).then(({ output, next}) => {
        t.deepEqual(input, output);
        t.is(next, spec.Choices[0].Next);
    });

});
