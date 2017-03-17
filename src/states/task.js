const Retry = require('./error/retry');


function mock(spec) {
    const { Resource, TimeoutSeconds = 60, HeartbeatSeconds } = spec;

    return function (input) {
        const { SleepSeconds = [] } = input;

        return new Promise((resolve, reject) => {

            let timer = setTimeout(() => {
                clearTimeout(resource);
                reject({
                    Error: 'States.Timeout',
                    Cause: 'Request timeout.',
                });
            }, TimeoutSeconds * 1000);

            // Mock remote resource.
            let resource = setTimeout(() => {
                clearTimeout(timer);
                resolve({ Resource });
            }, (SleepSeconds.shift() || 0) * 1000);

        });
    }
}


function Task(name, spec, input) {
    const task = mock(spec);
    return Retry.wrap(task, spec).run(input);
}


module.exports = Task;
