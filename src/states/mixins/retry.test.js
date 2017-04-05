const test = require('ava');
const RetryMixin = require('./retry');


const Retry = RetryMixin(class Base {
    run(input) {
        const { Errors = [], Result } = input;
        return new Promise((resolve, reject) => {
            const error = Errors.shift();
            if (error) {
                reject({ Error: error });
                return;
            }
            resolve({ output: Result });
        });
    }
});


test('Retry, exhaust max', t => {

    const spec = {
        Retry: [
            {
                ErrorEquals: [ 'States.Timeout' ],
                MaxAttempts: 1,
            }
        ],
    };

    const input = {
        Errors: [ 'States.Timeout', 'States.Timeout', 'States.Timeout' ],
        Result: {
            foo: 'bar',
        },
    };

    const retry = new Retry(spec);
    return t.throws(retry.run(input)).then((output) => {
        const { Error } = output;
        t.is(Error, 'States.Timeout');
    });

});


test('Retry, no wildcard', t => {

    const spec = {
        Retry: [{
            ErrorEquals: [ 'States.Timeout' ],
            MaxAttempts: 3,
        }],
    };

    const input = {
        Errors: [ 'States.Timeout', 'States.Timeout' ],
        Result: {
            foo: 'bar',
        },
    };

    const retry = new Retry(spec);
    return retry.run(input).then(({ output }) => {
        t.is(output, input.Result);
    });

});


test('Retry, with wildcard', t => {

    const spec = {
        Retry: [
            {
                ErrorEquals: [ 'States.Timeout' ],
                MaxAttempts: 1,
            },
            {
                ErrorEquals: [ 'States.ALL' ],
                MaxAttempts: 2,
            },
        ],
    };

    const input = {
        Errors: [ 'States.Uncaught', 'States.Uncaught' ],
        Result: {
            foo: 'bar',
        },
    };

    const retry = new Retry(spec);
    return retry.run(input).then(({ output }) => {
        t.is(output, input.Result);
    });

});


test('Retry, with wildcard and exhaust max', t => {

    const spec = {
        Retry: [
            {
                ErrorEquals: [ 'States.Timeout' ],
                MaxAttempts: 1,
            },
            {
                ErrorEquals: [ 'States.ALL' ],
                MaxAttempts: 1,
            },
        ],
    };

    const input = {
        Errors: [ 'States.Uncaught', 'States.Uncaught', 'States.Uncaught' ],
        Result: {
            foo: 'bar',
        },
    };

    const retry = new Retry(spec);
    return t.throws(retry.run(input)).then(({ Error }) => {
        t.is(Error, 'States.Uncaught');
    });

});


test('Retry, unmatched', t => {

    const spec = {
        Retry: [
            {
                ErrorEquals: [ 'States.Timeout' ],
                MaxAttempts: 1,
            },
        ],
    };

    const input = {
        Errors: [ 'States.Uncaught' ],
        Result: {
            foo: 'bar',
        },
    };

    const retry = new Retry(spec);
    return t.throws(retry.run(input)).then(({ Error }) => {
        t.is(Error, 'States.Uncaught');
    });

});


test('Retry, no max attempts', t => {

    const spec = {
        Retry: [
            {
                ErrorEquals: [ 'States.Timeout' ],
            },
        ],
    };

    const input = {
        Errors: [ 'States.Timeout' ],
        Result: {
            foo: 'bar',
        },
    };

    const retry = new Retry(spec);
    return retry.run(input).then(({ output }) => {
        t.is(output, input.Result);
    });

});
