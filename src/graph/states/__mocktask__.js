

function mock(input) {
    const { SleepSeconds = [], Result } = input;
    return new Promise(resolve => {
        const time = (SleepSeconds.shift() || 0) * 1000;
        setTimeout(resolve, time, Result);
    });
}


module.exports = mock;
