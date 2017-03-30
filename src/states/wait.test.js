const test = require('ava');
const Wait = require('./wait');


test('timestampPath', t => {

    const then = Date.now() + 1000;
    const spec = { TimestampPath: '$.ts', Next: 'Next' };
    const input = { ts: new Date(then).toISOString() };

    const start = Date.now();
    const w = new Wait(spec);
    return w.run(input).then(({ output, next }) => {
        const duration = Date.now() - start;
        t.true(duration > 800 && duration < 1200);
        t.deepEqual(output, input);
        t.is(next, spec.Next);
    });

});


test('timestamp', t => {

    const then = Date.now() + 1000;
    const spec = { Timestamp: new Date(then).toISOString(), Next: 'Next' };
    const input = {};

    const start = Date.now();
    const w = new Wait(spec);
    return w.run(input).then(({ output, next }) => {
        const duration = Date.now() - start;
        t.true(duration > 800 && duration < 1200);
        t.deepEqual(output, input);
        t.is(next, spec.Next);
    });

});


test('secondsPath', t => {

    const spec = { SecondsPath: '$.seconds', Next: 'Next' };
    const input = { seconds: 1 };

    const start = Date.now();
    const w = new Wait(spec);
    return w.run(input).then(({ output, next }) => {
        const duration = Date.now() - start;
        t.true(duration > 800 && duration < 1200);
        t.deepEqual(output, input);
        t.is(next, spec.Next);
    });

});


test('seconds', t => {

    const spec = { Seconds: 1, Next: 'Next' };
    const input = {};

    const start = Date.now();
    const w = new Wait(spec);
    return w.run(input).then(({ output, next }) => {
        const duration = Date.now() - start;
        t.true(duration > 800 && duration < 1200);
        t.deepEqual(output, input);
        t.is(next, spec.Next);
    });

});
