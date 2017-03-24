

// Inspired by:
// https://gist.github.com/jakearchibald/31b89cba627924972ad6
// https://www.promisejs.org/generators/

function proceed(iterable, verb, arg) {
    const { value, done } = iterable[verb](arg);

    if (done) {
        return value;
    }

    return Promise.resolve(value)
        .then(output => proceed(iterable, 'next', output))
        .catch(error => proceed(iterable, 'throw', error));
};


function async(generator) {
    return (...args) => {
        try {
            const iterable = generator(...args);
            return proceed(iterable, 'next');
        } catch (error) {
            return Promise.reject(error);
        }
    }
}


module.exports = {
    async,
};
