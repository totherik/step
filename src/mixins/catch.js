const mixins = require('./mixins');
const Runner = require('./runner');


class Catcher extends mixins(Runner) {

    static create(name, spec, factory) {
        const { ErrorEquals, Next } = spec;

        const catcher = new Catcher(name, spec);
        catcher.errorEquals = ErrorEquals;

        // Initialize the Runner mixin property.
        catcher.next = factory.build(Next);

        return catcher;
    }

    constructor(name, spec) {
        super(name, spec);
        this.errorEquals = undefined;
    }

    match({ Error }) {
        return this.errorEquals.includes(Error);
    }

    isWildcard() {
        return this.errorEquals.length === 1 && this.errorEquals[0] === 'States.ALL';
    }

    run(input) {
        return super.run(input);
    }

}


function Catch(Base) {

    return class Catch extends Base {

        constructor(name, spec) {
            super(name, spec)
            this.catchers = [];
        }

        run(input) {
            return super.run(input).catch(error => this.catch(error));
        }

        catch(error) {
            const catcher = this.catchers.find((catcher, index, catchers) => {
                if (catcher.match(error)) {
                    return true;
                }

                /**
                 * 'The reserved name “States.ALL” appearing in a Catcher's “ErrorEquals”
                 * field is a wild-card and matches any Error Name. Such a value MUST appear
                 * alone in the “ErrorEquals” array and MUST appear in the last Catcher
                 * in the “Catch” array.'
                 *
                 * TODO: See if this rule can be enforced during validation.
                 */
                if (index === catchers.length - 1 && catcher.isWildcard()) {
                    return true;
                }

                return false;
            });

            if (catcher) {
                return catcher.run(error);
            }

            return Promise.reject(error);
        }

    }

}


Catch.createCatchers = function (name, { Catch = [] }, factory) {
    return Catch.map((catcher, index) => Catcher.create(`${name}_Catcher_${index}`, catcher, factory));
};


module.exports = Catch;
