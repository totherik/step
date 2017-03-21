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


test('Wait (Seconds)', t => {

    const then = Date.now();
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
    const machine = Machine.create(json);

    return machine.run(input).then(result => {
        const now = Date.now();
        const duration = now - then;
        t.true(duration >= limit);
    });

});


test('Wait (SecondsPath)', t => {

    const then = Date.now();
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
    const machine = Machine.create(json);

    return machine.run(input).then(result => {
        const now = Date.now();
        const duration = now - then;
        t.true(duration >= limit);
    });

});


test('Wait (Timestamp)', t => {

    const then = Date.now();
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
    const machine = Machine.create(json);

    return machine.run(input).then(result => {
        const now = Date.now();
        const duration = now - then;
        t.true(duration >= limit);
    });

});


test('Wait (TimestampPath)', t => {

    const then = Date.now();
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
    const machine = Machine.create(json);

    return machine.run(input).then(result => {
        const now = Date.now();
        const duration = now - then;
        t.true(duration >= limit);
    });

});
