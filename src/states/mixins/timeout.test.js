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


test('Completes', t => {

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


test('Timeout triggered', t => {

    const spec = {
        TimeoutSeconds: 1,
    };

    const input = {
        SleepSeconds: [ 2 ],
    };

    const timeout = new Timeout(spec)
    return t.throws(timeout.run(input)).then(error => {
        // In this case we get a normalized error as this is triggered in
        // lieu of any work done by State to format errors.
        const { Error, Cause } = error;
        t.is(Error, 'States.Timeout');
        t.is(Cause, 'State \'undefined\' exceeded the configured timeout of 1 seconds.');
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
    return t.throws(timeout.run(input)).then(error => {
        // In this case we get an error because we haven't mixed in State
        // to do any normalization of errors returned by `run`.
        t.true(error instanceof Error)
    });

});
