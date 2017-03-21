

function Runner(Base) {

    return class Runner extends Base {

        constructor(name, spec, factory) {
            super(name, spec, factory);

            const { Next, End = false } = spec;
            this.next = factory.build(Next);
            this.end = End;
        }

        continue(input) {
            if (this.next) {
                return this.next.run(input);
            }

            if (this.end) {
                return Promise.resolve(input);
            }

            return Promise.reject({ Error: `Invalid terminal state '${name}'.`})
        }

    };

}


module.exports = Runner;
