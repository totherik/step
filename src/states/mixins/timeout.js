

function Timeout(Base) {

    return class Timeout extends Base {

        constructor(name, spec, factory) {
            super(name, spec, factory);

            const { TimeoutSeconds } = spec;
            this.timeoutSeconds = TimeoutSeconds;
        }

        setTimeout(promise) {
            const { timeoutSeconds } = this;

            if (isNaN(timeoutSeconds)) {
                return promise;
            }

            return new Promise((resolve, reject) => {

                // Once a promise is settled, additional calls to resolve/reject are a noop.
                const timer = setTimeout(reject, timeoutSeconds * 1000, { Error: 'States.Timeout' });

                promise
                    .then((result) => {
                        clearTimeout(timer);
                        resolve(result);
                    })
                    .catch(error => {
                        clearTimeout(timer);
                        reject(error);
                    });

            });
        }

    };

}


module.exports = Timeout;
