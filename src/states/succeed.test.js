const test = require('ava');
const Succeed = require('./succeed');


test('succeed', t => {

    const spec = {};
    const input = { foo: 'bar' };

    const succeed = new Succeed(spec);
    return succeed.run(input).then(({ output, next }) => {
        t.deepEqual(output, input);
        t.is(next, undefined);
    });

});
