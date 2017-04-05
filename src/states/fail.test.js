const test = require('ava');
const Fail = require('./fail');


test('succeed', t => {

    const spec = { Error: 'error', Cause: 'cause' };
    const input = { Error: 'original error', Cause: 'original cause' };

    const fail = new Fail(spec);
    return t.throws(fail.run(input)).then(error => {
        t.deepEqual(error, input);
    });

});
