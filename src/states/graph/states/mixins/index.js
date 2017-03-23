const State = require('./state');


function mixins(...factories) {

    factories.unshift(State);
    return factories.reduce((cls, factory) => factory(cls), class Base {});
}


module.exports = mixins;
