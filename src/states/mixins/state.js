

function State(Base) {

    return class State extends Base {

        constructor(name, { Type, Comment }) {
            super();
            this.name = name;
            this.type = Type;
            this.comment = Comment;
        }

        run(input) {
            return this._run(input);
        }

        _run(input) {
            return Promise.resolve(input);
        }

    };

}


module.exports = State;
