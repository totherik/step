

function mixins(...factories) {

    class Base {

        run(input) {
            return this._run(input);
        }

        _run(input) {
            return Promise.reject({ Error: 'Not implemented.' });
        }

    };

    return factories.reduce((cls, factory) => factory(cls), Base);
}


module.exports = mixins;
