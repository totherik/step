

function ErrorMatcher(Base) {

    return class ErrorMatcher extends Base {

        constructor(name, spec, factory) {
            super(name, spec, factory);

            const { ErrorEquals } = spec;
            this.errorEquals = ErrorEquals;
        }

        match({ Error }) {
            return this.errorEquals.includes(Error);
        }

        isWildcard() {
            return this.errorEquals.length === 1 && this.errorEquals[0] === 'States.ALL';
        }

    };

}


module.exports = ErrorMatcher;
