const State = require('./state');
const Retry = require('./retry');
const Filter = require('./filter');
const Timeout = require('./timeout');


function mixin(...factories) {
    factories.unshift(State);
    return factories.reduce((cls, factory) => factory(cls), class Base {});
}


module.exports = {
    mixin,
    Retry,
    Filter,
    Timeout,
};
