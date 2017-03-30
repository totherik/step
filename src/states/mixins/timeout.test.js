const test = require('ava');
const TimeoutMixin = require('./timeout');


const Timeout = TimeoutMixin(class Base {
    run(input) {
        const { SleepSeconds = [], Error, Result } = input;

        if (Error) {
            return Promise.reject(Error);
        }

        return new Promise(resolve => {
            setTimeout(resolve, (SleepSeconds.shift() || 0) * 1000, Result);
        });
    }
});


test('Timeout', t => {

    const spec = {
        TimeoutSeconds: 1,
    };

    const input = {
        SleepSeconds: [ 0 ],
        Result: 'foo',
    };

    const timeout = new Timeout(spec)
    return timeout.run(input).then(result => {
        t.is(result, input.Result);
    });

});


test('Timeout not triggered', t => {

    const spec = {
        TimeoutSeconds: 1,
    };

    const input = {
        SleepSeconds: [ 2 ],
    };

    const timeout = new Timeout(spec)
    return t.throws(timeout.run(input)).then(({ Error }) => {
        t.is(Error, 'States.Timeout');
    });

});


test('Error', t => {

    const spec = {
        TimeoutSeconds: 1,
    };

    const input = {
        Error: new Error('Broken')
    };

    const timeout = new Timeout(spec);
    return t.throws(timeout.run(input)).then((output) => {
        t.true(output instanceof Error);
    });

});
