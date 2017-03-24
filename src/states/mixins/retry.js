

function Retry(Base) {

    return class Retry extends Base {

        constructor(spec) {
            super(spec);
            this.retriers = spec.Retry || [];
            this.catchers = spec.Catch || [];
        }

        run(input) {
            const task = () => super.run(input);
            return this.retry(task).catch(error => this.catch(error));
        }

        retry(task) {
            const counts = new WeakMap();

            const retry = error => {
                const retrier = this.match(this.retriers, error, { MaxAttempts: 0 });
                const { MaxAttempts = 3, IntervalSeconds = 1, BackoffRate = 2.0 } = retrier;

                const attempts = counts.get(retrier) || 0;
                const seconds = IntervalSeconds + (attempts * BackoffRate);

                if (attempts >= MaxAttempts) {
                    return Promise.reject(error);
                }

                counts.set(retrier, attempts + 1);
                return wait(run, seconds * 1000);
            };

            const wait = (fn, duration) => {
                return new Promise(resolve => {
                    setTimeout(resolve, duration);
                }).then(fn);
            };

            const run = () => {
                return task().catch(retry);
            };

            return run();
        }

        catch(error) {
            const catcher = this.match(this.catchers, error);

            if (catcher) {
                return {
                    output: error,
                    next: catcher.Next,
                };
            }

            return Promise.reject(error);
        }

        match(rules, { Error }, fallback) {
            const matcher = ({ ErrorEquals }, index, rules) => {
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
                if (index === rules.length - 1 && ErrorEquals.length === 1 && ErrorEquals[0] === 'States.ALL') {
                    return true;
                }

                return false;
            };

            return rules.find(matcher) || fallback;
        }

    };

}


module.exports = Retry;
