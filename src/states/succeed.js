

function Succeed(name, spec, input) {
    return Promise.resolve(input);
}

module.exports = Succeed;
