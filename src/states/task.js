const Retryable = require('./error/retryable');


function mock(spec) {
    const { Resource, TimeoutSeconds = 60, HeartbeatSeconds } = spec;

    return function (input) {
        const { SleepSeconds = [] } = input;
        // console.log('mock');
        return new Promise((resolve, reject) => {

            let timer = setTimeout(() => {
                // console.log('aborting task');
                clearTimeout(resource);
                reject('States.Timeout');
            }, TimeoutSeconds * 1000);

            // Mock remote resource.
            let resource = setTimeout(() => {
                // console.log('clearing timeout');
                clearTimeout(timer);
                resolve({ Resource });
            }, (SleepSeconds.shift() || 0) * 1000);

        });
    }


}


function Task(name, spec, input) {
    const task = mock(spec);
    return Retryable.create(task, spec).run(input);
}

module.exports = Task;
