

function mixins(...factories) {

    // They should be ordered, so to appropriately apply them, reverse them.
    factories.reverse();

    let base = class Base {}
    for (const factory of factories) {
        base = factory(base);
    }

    return base;
}


module.exports = mixins;
