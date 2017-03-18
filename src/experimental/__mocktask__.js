

function mock(task) {
    const { resource, timeoutSeconds } = task;

    return function (input) {
        const { SleepSeconds = [], Result } = input;

        return new Promise((resolve, reject) => {

            let timeout = setTimeout(() => {
                clearTimeout(timer);
                reject({
                    Error: 'States.Timeout',
                    Cause: 'Request timeout.',
                });
            }, timeoutSeconds * 1000);

            // Mock remote resource.
            let timer = setTimeout(() => {
                clearTimeout(timeout);
                resolve(Result);
            }, (SleepSeconds.shift() || 0) * 1000);

        });
    }
}


module.exports = mock;
