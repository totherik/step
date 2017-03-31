const test = require('ava');
const FilterMixin = require('./filter');


const Filter = FilterMixin(class Base {
    run(input) {

        if (input.error) {
            return Promise.reject(new Error(input.error));
        }

        if (input.result) {
            input = input.result;
        }

        return Promise.resolve({ output: input })
    }
});


test('Paths are undefined', t => {

    const spec = {};
    const input = {
        foo: 'bar',
    };

    const filter = new Filter(spec);
    return filter.run(input).then(({ output }) => {
        t.deepEqual(output, input);
    });

});


test('InputPath is "$"', t => {

    const spec = {
        // Should be a noop.
        InputPath: '$',
    };

    const input = {
        foo: 'bar',
    };

    const filter = new Filter(spec);
    return filter.run(input).then(({ output }) => {
        t.deepEqual(output, input);
    });

});


test('InputPath is null', t => {

    const spec = {
        // Should return new object.
        InputPath: null,
    };

    const input = {
        foo: 'bar',
    };

    const filter = new Filter(spec);
    return filter.run(input).then(({ output }) => {
        t.is(typeof output, 'object');
        t.notDeepEqual(output, input);
    });

});


test('InputPath is definite', t => {

    const spec = {
        // Should return new object.
        InputPath: '$.foo',
    };

    const input = {
        foo: 'bar',
    };

    const filter = new Filter(spec);
    return filter.run(input).then(({ output }) => {
        t.is(output, 'bar');
    });

});


test('InputPath is indefinite', t => {

    const spec = {
        // Should return new object.
        InputPath: '$..foo',
    };

    const input = {
        foo: 'bar',
        bar: {
            foo: 'baz'
        }
    };

    const filter = new Filter(spec);
    return filter.run(input).then(({ output }) => {
        t.true(Array.isArray(output));
        t.is(output[0], input.foo);
        t.is(output[1], input.bar.foo);
    });

});


test('ResultPath is "$"', t => {

    const spec = {
        // Should be a noop.
        ResultPath: '$',
    };

    const input = {
        foo: 'bar',
    };

    const filter = new Filter(spec);
    return filter.run(input).then(({ output }) => {
        t.deepEqual(output, input);
    });

});


test('ResultPath is null', t => {

    const spec = {
        // Should return input.
        ResultPath: null,
    };

    const input = {
        foo: 'bar',
    };

    const filter = new Filter(spec);
    return filter.run(input).then(({ output }) => {
        t.deepEqual(output, input);
    });

});


test('ResultPath is set to a non-Reference Path', t => {

    const spec = {
        // Should return input.
        ResultPath: '$..foo',
    };

    const input = {
        foo: 'bar',
    };

    const filter = new Filter(spec);
    return t.throws(filter.run(input)).then(({ output, next }) => {
        t.is(output.Error, 'States.ResultPathMatchFailure');
        t.is(next, undefined);
    });

});


test('ResultPath is set to existing property.', t => {

    const spec = {
        // Should return new object.
        ResultPath: '$.foo',
    };

    const input = {
        result: {
            foo: 'bar'
        },
        foo: 'baz'
    };

    const filter = new Filter(spec);
    return filter.run(input).then(({ output }) => {
        t.deepEqual(output.foo, input.result);
    });

});


test('ResultPath is set to non-existent property.', t => {

    const spec = {
        // Should return new object.
        ResultPath: '$.foo',
    };

    const input = {
        result: {
            foo: 'bar',
        },
    };

    const filter = new Filter(spec);
    return filter.run(input).then(({ output }) => {
        t.deepEqual(output.foo, input.result);
    });

});


test('ResultPath is set to non-existent nested property.', t => {

    const spec = {
        // Should return new object.
        ResultPath: '$.foo.bar.baz',
    };

    const input = {
        result: {
            foo: 'bar',
        },
    };

    const filter = new Filter(spec);
    return filter.run(input).then(({ output }) => {
        t.deepEqual(output.foo.bar.baz, input.result);
    });

});


test('ResultPath is set to nested property.', t => {

    const spec = {
        // Should return new object.
        ResultPath: '$.a.b.c',
    };

    const input = {
        result: {
            foo: 'bar',
        },
        a: {
            b: {
                c: 'foo',
            },
        },
    };

    const filter = new Filter(spec);
    return filter.run(input).then(({ output }) => {
        t.deepEqual(output.a.b.c, input.result);
    });

});


test('ResultPath is non-traversable property.', t => {

    const spec = {
        // Should return new object.
        ResultPath: '$.a.length',
    };

    const input = {
        result: {
            foo: 'bar'
        },
        a: []
    };

    const filter = new Filter(spec);
    return t.throws(filter.run(input)).then(({ output, next }) => {
        t.is(output.Error, 'States.ResultPathMatchFailure');
        t.is(next, undefined);
    });

});


test('OutputPath is null', t => {

    const spec = {
        // Should return new object.
        OutputPath: null,
    };

    const input = {
        foo: 'bar',
    };

    const filter = new Filter(spec);
    return filter.run(input).then(({ output }) => {
        t.is(typeof output, 'object');
        t.notDeepEqual(output, input);
    });

});


test('OutputPath is "$"', t => {

    const spec = {
        // Should return new object.
        OutputPath: '$',
    };

    const input = {
        foo: 'bar',
    };

    const filter = new Filter(spec);
    return filter.run(input).then(({ output }) => {
        t.deepEqual(output, input);
    });

});


test('InputPath is definite', t => {

    const spec = {
        // Should return new object.
        OutputPath: '$.foo',
    };

    const input = {
        foo: 'bar',
    };

    const filter = new Filter(spec);
    return filter.run(input).then(({ output }) => {
        t.is(output, 'bar');
    });

});


test('OutputPath is indefinite', t => {

    const spec = {
        // Should return new object.
        OutputPath: '$..foo',
    };

    const input = {
        foo: 'bar',
        bar: {
            foo: 'baz'
        }
    };

    const filter = new Filter(spec);
    return filter.run(input).then(({ output }) => {
        t.true(Array.isArray(output));
        t.is(output[0], input.foo);
        t.is(output[1], input.bar.foo);
    });

});
