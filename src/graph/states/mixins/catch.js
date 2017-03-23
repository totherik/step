const PathUtils = require('../../../pathutils');


function Catch(Base) {

    return class Catch extends Base {

        constructor(spec) {
            super(spec);
            this.catchers = spec.Catch || [];
        }

        run(data) {
            const reject = error => {
                const catcher = this.match(error);
                if (catcher) {
                    this.next = catcher.Next;
                    return error;
                }
                return Promise.reject(error);
            };

            return super.run(data).catch(reject);
        }

        match({ Error }) {
            return this.catchers.find(({ ErrorEquals }, index, catchers) => {
                if (ErrorEquals.includes(Error)) {
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
                if (catchers.length === 1 && ErrorEquals.length === 1 && ErrorEquals[0] === 'States.ALL') {
                    return true;
                }

                return false;
            });
        }

    };

}

module.exports = Catch;
