

function Wait(name, spec, input) {
    const { Seconds } = spec;
    return new Promise(resolve => {
        setTimeout(resolve, Seconds * 1000, input);
    });
}

module.exports = Wait;
