

function State(Base) {

    return class State extends Base {

        constructor(spec) {
            super(spec);
            this.name = spec.Name;
            this.type = spec.Type;
            this.comment = spec.Comment;
            this.next = spec.Next;
        }

        run(data) {
            const defaults = { next: this.next };

            const start = process.hrtime();
            const merge = result => {
                console.log(this.name, this.type, '_run', process.hrtime(start));
                return Object.assign(defaults, result);
            };

            return this._run(data).then(merge);
        }

        _run(input) {
            return Promise.reject({ Error: 'Not implemented.' });
        }

    };

}


module.exports = State;
