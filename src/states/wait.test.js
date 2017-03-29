const test = require('ava').only;
const Wait = require('./wait');


test('timestampPath', t => {

    const then = Date.now() + 1000;
    const spec = { TimestampPath: '$.ts'};
    const input = { ts: new Date(then).toISOString() };

    const start = Date.now();
    const w = new Wait(spec);
    return w._run(input).then(({ output }) => {
        const duration = Date.now() - start;
        t.true(duration > 800 && duration < 1200);
        t.deepEqual(output, input);
    });

});


test('timestamp', t => {

    const then = Date.now() + 1000;
    const spec = { Timestamp: new Date(then).toISOString() };
    const input = {};

    const start = Date.now();
    const w = new Wait(spec);
    return w._run(input).then(({ output }) => {
        const duration = Date.now() - start;
        t.true(duration > 800 && duration < 1200);
        t.deepEqual(output, input);
    });

});


test('secondsPath', t => {

    const spec = { SecondsPath: '$.seconds' };
    const input = { seconds: 1 };

    const start = Date.now();
    const w = new Wait(spec);
    return w._run(input).then(({ output }) => {
        const duration = Date.now() - start;
        t.true(duration > 800 && duration < 1200);
        t.deepEqual(output, input);
    });

});

test('seconds', t => {

    const spec = { Seconds: 1 };
    const input = {};

    const start = Date.now();
    const w = new Wait(spec);
    return w._run(input).then(({ output }) => {
        const duration = Date.now() - start;
        t.true(duration > 800 && duration < 1200);
        t.deepEqual(output, input);
    });

});
