

function mock(task) {
    const { resource } = task;

    return function (input) {
        const { SleepSeconds = [], Result } = input;
        return new Promise((resolve, _) => {
            setTimeout(resolve, (SleepSeconds.shift() || 0) * 1000, Result);
        });
    }
}


module.exports = mock;
