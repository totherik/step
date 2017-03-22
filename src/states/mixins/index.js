

function mixins(...factories) {

    let base = class State {

        constructor(name, spec, factory) {
            const { Type, Comment } = spec;
            this.name = name;
            this.type = Type;
            this.comment = Comment;
        }

        run(input) {
            return this._run(input);
        }

        _run(input) {
            return Promise.reject({ Error: 'State not implemented.' });
        }

    };

    return factories.reduce((cls, factory) => factory(cls), base);
}


module.exports = mixins;
