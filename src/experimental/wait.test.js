const test = require('ava');
const Machine = require('./index');


function getInput(seconds = 3) {
    const then = new Date();
    then.setSeconds(then.getSeconds() + seconds);

    return {
        seconds,
        timestamp: then.toISOString(),
    };
}


test('Wait (Default)', t => {

    const input = getInput();

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Wait',
                End: true,
            },
        },
    };


    // This is an arbitrary number just to say that it ran without delay.
    // May cause false-negatives on very very slow machines?
    const limit = 100;
    const then = Date.now();

    const machine = Machine.create(json);
    return machine.run(input).then(result => {
        const now = Date.now();
        const duration = now - then;
        t.true(duration < limit);
    });

});


test('Wait (Seconds)', t => {

    const input = getInput();

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Wait',
                Seconds: 3,
                End: true,
            },
        },
    };

    const limit = json.States.One.Seconds * 1000;
    const then = Date.now();

    const machine = Machine.create(json);
    return machine.run(input).then(result => {
        const now = Date.now();
        const duration = now - then;
        t.true(duration >= limit);
    });

});


test('Wait (SecondsPath)', t => {

    const input = getInput();

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Wait',
                SecondsPath: '$.seconds',
                End: true,
            },
        },
    };

    const limit = input.seconds * 1000;
    const then = Date.now();

    const machine = Machine.create(json);
    return machine.run(input).then(result => {
        const now = Date.now();
        const duration = now - then;
        t.true(duration >= limit);
    });

});


test('Wait (Timestamp)', t => {

    const input = getInput();

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Wait',
                Timestamp: input.timestamp,
                End: true,
            },
        },
    };

    const limit = input.seconds * 1000;
    const then = Date.now();

    const machine = Machine.create(json);
    return machine.run(input).then(result => {
        const now = Date.now();
        const duration = now - then;
        t.true(duration >= limit);
    });

});


test('Wait (TimestampPath)', t => {

    const input = getInput();

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Wait',
                TimestampPath: '$.timestamp',
                End: true,
            },
        },
    };

    const limit = input.seconds * 1000;
    const then = Date.now();

    const machine = Machine.create(json);
    return machine.run(input).then(result => {
        const now = Date.now();
        const duration = now - then;
        t.true(duration >= limit);
    });

});
