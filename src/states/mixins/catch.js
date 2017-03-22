

class Catcher {

    static from(name, { Catch = [] }, factory) {
        return Catch.map((spec, index) => new Catcher(`${name}_Catcher_${index}`, spec, factory));
    }

    constructor(name, spec, factory) {
        const { ErrorEquals, Next } = spec;
        this.errorEquals = ErrorEquals;
        this.next = factory.build(Next);
    }

    match({ Error }) {
        return this.errorEquals.includes(Error);
    }

    isWildcard() {
        return this.errorEquals.length === 1 && this.errorEquals[0] === 'States.ALL';
    }

    run(input) {
        return this.next.run(input);
    }

}


function Catch(Base) {

    return class Catch extends Base {

        constructor(name, spec, factory) {
            super(name, spec, factory);
            this.catchers = Catcher.from(name, spec, factory);
        }

        catch(error) {
            const catcher = this.match(error);
            return catcher ? catcher.run(error) : Promise.reject(error);
        }

        match(error) {
            return this.catchers.find((catcher, index, catchers) => {
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
        }

    }

}


module.exports = Catch;
