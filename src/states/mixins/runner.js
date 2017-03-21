

function Runner(Base) {

    return class Runner extends Base {

        constructor(name, spec) {
            super(name, spec);
            this.next = undefined;
            this.end = false;
        }

        run(input) {
            const result = super.run(input);
            if (this.next) {
                return result.then(output => this.next.run(output));
            }
            return result;
        }

    };

}


module.exports = Runner;
