const test = require('ava');
const Pass = require('./pass');


test('defaults', t => {

    const spec = { Next: 'next' };
    const input = { foo: 'bar' };

    const pass = new Pass(spec);
    return pass.run(input).then(({ output, next }) => {
        t.deepEqual(output, input);
        t.is(next, spec.Next);
    });

});


test('result', t => {

    const spec = { Result: 'result', Next: 'next' };
    const input = { foo: 'bar' };

    const pass = new Pass(spec);
    return pass.run(input).then(({ output, next }) => {
        t.deepEqual(output, spec.Result);
        t.is(next, spec.Next);
    });

});
