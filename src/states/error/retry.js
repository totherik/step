const wait = require('../wait');


class Retry {

    static wrap(task, config) {
        return new Retry(task, config);
    }

    constructor(task, { Retry = [] }) {
        this.task = task;
        this.retriers = Retry.map(Retry => Object.assign({ RetryAttempts: 0 }, Retry));
    }

    match(error) {
        return this.retriers.find(({ ErrorEquals }, index, retriers) => {
            if (ErrorEquals.includes(error)) {
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
            if (index === retriers.length - 1 && ErrorEquals.length === 1 && ErrorEquals[0] === 'States.ALL') {
                return true;
            }

            return false;
        });
    }

    /**
     * 'A Retrier MAY contain a field named “IntervalSeconds”, whose
     * value MUST be a positive integer, representing the number of
     * seconds before the first retry attempt (default value: 1); a
     * field named “MaxAttempts” whose value MUST be a non-negative
     * integer, representing the maximum number of retry attempts
     * (default: 3); and a field named “BackoffRate”, a number which
     * is the multiplier that increases the retry interval on each
     * attempt (default: 2.0). The value of BackoffRate MUST be
     * greater than or equal to 1.0.
     *
     * Note that a “MaxAttempts” field whose value is 0 is legal,
     * specifying that some error or errors should never be retried.'
     */
    run(input) {

        const retry = output => {
            const { Error } = output;
            
            const retrier = this.match(Error)
            if (!retrier) {
                return Promise.reject(output);
            }

            const { RetryAttempts, MaxAttempts = 3 } = retrier;
            if (RetryAttempts === MaxAttempts) {
                return Promise.reject(output);
            }

            retrier.RetryAttempts += 1;

            const { IntervalSeconds = 1, BackoffRate = 2.0 } = retrier;
            const spec = {
                Seconds: IntervalSeconds + (RetryAttempts * BackoffRate),
            };

            const name = `${error}_Retry_Wait_${retrier.retryAttempts}`;
            return wait(name, spec, input).then(run);
        };

        const run = input => {
            return this.task(input).catch(retry);
        };

        return run(input);

    }

}


module.exports = Retry;
