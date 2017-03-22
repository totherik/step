const mixins = require('./index');
const Runner = require('./runner');
const Fail = require('../fail');
const ResultFilter = require('./resultfilter');
const ErrorMatcher = require('./errormatcher');


class Catcher extends mixins(ErrorMatcher, ResultFilter, Runner) {

    static from(name, { Catch = [] }, factory) {
        return Catch.map((spec, index) => new Catcher(`${name}_Catcher_${index}`, spec, factory));
    }

    constructor(name, spec, factory) {
        super(name, spec, factory);
    }

    run(input) {
        return super.run(input)
            .then(output => this.continue(output));
    }

    _run(input) {
        const filtered = this.filterResult(input);
        return Promise.resolve(filtered);
    }

}


function Catch(Base) {

    return class Catch extends Base {

        constructor(name, spec, factory) {
            super(name, spec, factory);
            this.catchers = Catcher.from(name, spec, factory);
        }

        catcher(error) {
            return this.match(error) || new Fail(`${this.name}_Failure`, error);
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
