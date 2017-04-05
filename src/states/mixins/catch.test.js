const test = require('ava');
const CatchMixin = require('./catch');


const Catch = CatchMixin(class Base {
    run(input) {
        const { Errors = [], Result } = input;
        return new Promise((resolve, reject) => {
            const error = Errors.shift();

            if (error instanceof Error) {
                reject(error);
                return;
            }

            if (error) {
                reject({ Error: error });
                return;
            }

            resolve({ output: Result });
        });
    }
});


test('Catch structured error', t => {

    const spec = {
        Retry: [
            {
                ErrorEquals: [ 'States.Timeout' ],
            },
        ],
        Catch: [
            {
                ErrorEquals: [ 'States.ALL' ],
                Next: 'Catch'
            }
        ]
    };

    const input = {
        Errors: [ 'States.ALL' ],
        Result: {
            foo: 'bar',
        },
    };

    const retry = new Catch(spec);
    return retry.run(input).then(({ output, next }) => {
        t.is(output.Error, 'States.ALL');
        t.is(next, spec.Catch[0].Next);
    });

});


test('Catch thrown error', t => {

    const spec = {
        Retry: [
            {
                ErrorEquals: [ 'States.Timeout' ],
            },
        ],
        Catch: [
            {
                ErrorEquals: [ 'States.ALL' ],
                Next: 'Catch'
            }
        ]
    };

    const input = {
        Errors: [ new Error('States.ALL') ],
        Result: {
            foo: 'bar',
        },
    };

    const retry = new Catch(spec);
    return retry.run(input).then(({ output, next }) => {
        t.is(output.Error, 'States.ALL');
        t.is(next, spec.Catch[0].Next);
    });

});
