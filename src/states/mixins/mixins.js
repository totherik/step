

function mixins(...factories) {

    let base = class Base {

        run(input) {
            return this._run(input);
        }

        _run(input) {
            return Promise.resolve(input);
        }

    };

    for (const factory of factories) {
        base = factory(base);
    }

    return base;
}


module.exports = mixins;
