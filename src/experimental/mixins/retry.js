

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

}


function Retry(Base) {

    return class Retry extends Base {

        constructor(name, spec) {
            super(name, spec);
            this.retriers = [];
        }

        run(input) {

            const attempts = new Map();

            const retry = output => {

                const retrier = this.match(output);
                if (!retrier) {
                    return Promise.reject(output);
                }

                let retries = attempts.get(retrier);
                if (typeof retries !== 'number') {
                    retries = 1;
                    attempts.set(retrier, retries);
                }

                if (retries === retrier.maxAttempts) {
                    return Promise.reject(output);
                }

                retries += 1;
                attempts.set(retrier, retries);

                const { intervalSeconds, backoffRate } = retrier;
                const delay = (intervalSeconds + (retries * backoffRate)) * 1000;

                return new Promise((resolve) => {
                    setTimeout(resolve, delay, input);
                }).then(run);
            };

            const run = input => {
                return super.run(input).catch(retry);
            };

            return run(input);

        }

        match(error) {
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


Retry.createRetriers = function(name, { Retry = [] }, factory) {
    return Retry.map(spec => new Retrier(spec));
};


module.exports = Retry;
