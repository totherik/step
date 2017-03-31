const test = require('ava');
const util = require('./util');



test('async success', t => {

    let results = [];

    const run = util.async(function *() {
        while (results.length < 2) {
            const result = yield 'ok';
            results.push(result);
        }
        return results;
    });

    return run().then(result => {
        t.true(Array.isArray(result));
        t.is(result.length, 2);
    });

});


test('async error', t => {

    let results = [];

    const run = util.async(function *() {
        while (results.length < 2) {
            const result = yield 'ok';
            results.push(result);
        }

        throw new Error('not ok');
    });

    return t.throws(run()).then(error => {
        t.is(error.message, 'not ok');
    });

});

test('async immediate error', t => {

    let results = [];

    const run = util.async(function *() {
        throw new Error('not ok');
    });

    return t.throws(run()).then(error => {
        t.is(error.message, 'not ok');
    });

});
