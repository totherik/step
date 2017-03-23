


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
                // Once a promise is settled, additional calls to resolve/reject are a noop.
                const timer = setTimeout(reject, timeoutSeconds * 1000, { Error: 'States.Timeout' });

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
