


function State(Base) {

    return class State extends Base {

        constructor(name, spec, factory) {
            super(name, spec, factory);

            const { Type, Comment } = spec;
            this.name = name;
            this.type = Type;
            this.comment = Comment;
        }

    };

}

module.exports = State;
