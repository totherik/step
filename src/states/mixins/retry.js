const { match } = require('./errorutils');


function Retry(Base) {

    return class Retry extends Base {

        constructor(spec) {
            super(spec);
            this.retriers = spec.Retry || [];
        }

        run(input) {
            const task = () => super.run(input);
            return this.retry(task);
        }

        retry(task) {
            const counts = new WeakMap();

            const retry = error => {
                const retrier = match(this.retriers, error.Error, { MaxAttempts: 0 });
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

    };

}


module.exports = Retry;
