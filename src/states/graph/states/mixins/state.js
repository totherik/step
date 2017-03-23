

function defer() {
    let resolve, reject;

    const promise = new Promise((a, b) => {
        resolve = a;
        reject = b;
    });

    return {
        promise,
        resolve,
        reject,
    };
}

function State(Base) {

    return class State extends Base {

        constructor(spec) {
            super(spec);
            this.next = spec.Next;
            this.deferred = defer();
        }

        run(data) {
            const { deferred: { promise, resolve, reject } } = this;
            this._run(data).then(resolve, reject);
            return promise;
        }

        _run(input) {
            return Promise.reject('Not implemented.');
        }

        getNext() {
            // Don't read edge until value resolves. Some decisions, such
            // as Catch, are determined by outcome of State.
            const { next, deferred: { promise } } = this;
            const fulfilled = () => next;
            return promise.then(fulfilled, fulfilled);
        }

    };

}


module.exports = State;
