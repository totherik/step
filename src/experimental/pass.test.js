const test = require('ava');
const Machine = require('./index');


test('Pass', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Pass',
                End: true,
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'bar' };

    return machine.run(input).then(output => {
        t.deepEqual(output, input);
    });

});


test('Result', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Pass',
                Result: {
                    bar: 'foo',
                },
                End: true,
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'bar' };

    return machine.run(input).then(output => {
        t.is(output.foo, undefined);
        t.is(output.bar, 'foo');
    });

});


test('ResultPath (existing property)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Pass',
                Result: {
                    bar: 'foo',
                },
                ResultPath: '$.target',
                End: true,
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'bar', target: 'target' };

    return machine.run(input).then(output => {
        t.is(output.foo, 'bar');
        t.deepEqual(output.target, json.States.One.Result);
    });

});


test('ResultPath (new property)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Pass',
                Result: {
                    bar: 'foo',
                },
                ResultPath: '$.target',
                End: true,
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'bar' };

    return machine.run(input).then(output => {
        t.is(output.foo, 'bar');
        t.deepEqual(output.target, json.States.One.Result);
    });

});


test('ResultPath (non-Reference path)', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Pass',
                Result: {
                    bar: 'foo',
                },
                ResultPath: '$.*',
                End: true,
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'bar' };

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
                Type: 'Pass',
                InputPath: '$.foo',
                End: true,
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'bar' };

    return machine.run(input).then(output => {
        t.is(output, 'bar');
    });

});


test('InputPath null', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Pass',
                InputPath: null,
                End: true,
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'bar' };

    return machine.run(input).then(output => {
        t.is(typeof output, 'object');
        t.notDeepEqual(input, output);
    });

});


test('OutputPath', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Pass',
                OutputPath: '$.foo',
                End: true,
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'bar' };

    return machine.run(input).then(output => {
        t.is(output, 'bar');
    });

});


test('InputPath null', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Pass',
                OutputPath: null,
                End: true,
            },
        },
    };

    const machine = Machine.create(json);
    const input = { foo: 'bar' };

    return machine.run(input).then(output => {
        t.is(typeof output, 'object');
        t.notDeepEqual(input, output);
    });

});
