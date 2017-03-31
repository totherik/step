

function Timeout(Base) {

    return class Timeout extends Base {

        constructor(spec) {
            super(spec);
            this.timeoutSeconds = spec.TimeoutSeconds;
        }

        run(data) {
            const { timeoutSeconds } = this;
            const promise = super.run(data);

            if (isNaN(timeoutSeconds)) {
                return promise;
            }

            return new Promise((resolve, reject) => {

                // TODO: Rationalize error formatting. In this case
                // the error is returned in lieu our base class as the
                // task has not yet been run to completion. This could
                // probably be cleaned up and centralized.
                // @see ./filter.js
                // @see ./state.js
                const result = {
                    output: {
                        Error: 'States.Timeout',
                        Cause: `State '${this.name}' exceeded the configured timeout of ${timeoutSeconds} seconds.`
                    },
                    next: undefined
                };

                // Once a promise is settled, additional calls to resolve/reject are a noop.
                const timer = setTimeout(reject, timeoutSeconds * 1000, result);

                promise
                    .then(result => {
                        clearTimeout(timer);
                        resolve(result);
                    })
                    .catch(error => {
                        clearTimeout(timer);
                        reject(error);
                    });
            });

        }

    }
}


module.exports = Timeout;
