const test = require('ava');
const Task = require('./task');


test('Mock Task', t => {

    const spec = {
        Resource: '__mockresource__',
        Next: 'next',
    };

    const input = { Result: 'result' };

    const task = new Task(spec);
    return task.run(input).then(({ output, next }) => {
        t.deepEqual(output, input.Result);
        t.is(next, spec.Next);
    });

});


test('OpenWhisk Task', t => {

    const spec = {
        Resource: 'step_test_action',
        ResultPath: '$.response.result',
        Next: 'next',
    };

    const input = { foo: 'bar' };

    const task = new Task(spec);
    return task.run(input).then(({ output, next }) => {
        t.deepEqual(output, input);
        t.is(next, spec.Next);
    });

});


test('No Task Impl', t => {

    const key = process.env['__OW_API_KEY'];
    process.env['__OW_API_KEY'] = '';

    const spec = {
        Resource: 'not_found',
        Next: 'next',
    };

    const input = { foo: 'bar' };

    const task = new Task(spec);
    return t.throws(task.run(input)).then(error => {
        t.is(error.message, 'No task implementation provided to execute resource not_found.');
        process.env['__OW_API_KEY'] = key;
    });

});
