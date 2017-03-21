

class Retrier {

    constructor({ ErrorEquals = [], IntervalSeconds = 1, MaxAttempts = 3, BackoffRate = 2.0 }) {
        this.errorEquals = ErrorEquals;
        this.intervalSeconds = IntervalSeconds;
        this.maxAttempts = MaxAttempts;
        this.backoffRate = BackoffRate;
    }

    match({ Error }) {
        return this.errorEquals.includes(Error);
    }

    isWildcard() {
        return this.errorEquals.length === 1 && this.errorEquals[0] === 'States.ALL';
    }

    canContinue(attempts) {
        return attempts <= this.maxAttempts;
    }

    getDelay(attempts) {
        return this.intervalSeconds + (attempts * this.backoffRate);
    }

}


function Retry(Base) {

    return class Retry extends Base {

        constructor(name, spec, factory) {
            super(name, spec, factory);

            const { Retry = [] } = spec;
            this.retriers = Retry.map(spec => new Retrier(spec));
        }

        retry(fn, input) {
            const counts = new WeakMap();

            const retry = output => {
                const retrier = this._match(output);
                if (!retrier) {
                    return Promise.reject(output);
                }

                let attempts = counts.get(retrier) || 1;
                if (!retrier.canContinue(attempts)) {
                    return Promise.reject(output);
                }

                counts.set(retrier, attempts + 1);

                const seconds = retrier.getDelay(attempts - 1);
                return wait(input, seconds).then(run);
            };

            const wait = (value, seconds) => {
                return new Promise(resolve => {
                    setTimeout(resolve, seconds * 1000, value);
                });
            };

            const run = input => {
                return fn(input).catch(retry);
            };

            return run(input);
        }

        _match(error) {
            return this.retriers.find((retrier, index, retriers) => {
                if (retrier.match(error)) {
                    return true;
                }

                /**
                 * 'The reserved name “States.ALL” in a Retrier’s “ErrorEquals”
                 * field is a wild-card and matches any Error Name. Such a value MUST
                 * appear alone in the “ErrorEquals” array and MUST appear in the
                 * last Retrier in the “Retry” array.'
                 *
                 * TODO: See if this rule can be enforced during validation.
                 */
                if (index === retriers.length - 1 && retrier.isWildcard()) {
                    return true;
                }

                return false;
            });
        }

    }

}


module.exports = Retry;
