const test = require('ava');
const Parallel = require('./parallel');


const Machine = {
    create(spec) {
        return {
            run({ Result }) {
                return Promise.resolve({ output: Result });
            },
        };
    },
};


test('parallel', t => {

    const spec = {
        // These are faux specs used by the mock Machine.
        Branches: [
            {
                Type: 'Pass',
                Result: 'foo',
            },
            {
                Type: 'Pass',
                Result: 'bar',
            },
            {
                Type: 'Pass',
                Result: 'baz',
            }
        ],
        Next: 'next',
    };

    const input = {};

    const parallel = new Parallel(spec, Machine);
    parallel.run(input).then(({ output, next }) => {
        t.true(Array.isArray(output));
        t.is(next, spec.Next);

        const results = spec.Branches.map(({ Result }) => Result);
        for (const result of results) {
            t.true(output.includes(result));
        }
    });

});


test('no branches', t => {

    const spec = {
        Next: 'next',
    };

    const input = {};

    const parallel = new Parallel(spec, Machine);
    parallel.run(input).then(({ output, next }) => {
        t.true(Array.isArray(output));
        t.is(output.length, 0);
        t.is(next, spec.Next);
    });

});
