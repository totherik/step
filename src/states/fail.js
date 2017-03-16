

function fail(name, spec, input) {
    const { Error, Cause } = input;
    return Promise.reject({ Error, Cause });
}

module.exports = fail;
