
### State Interface
```js

class State {

    constructor(name, spec) {

    }

    /**
     * @return Promise
     */
    run(input) {
        return input;
    }

    /**
     * @return Promise
     *
     * NOTE: This could also return a JSON-compatible type, but in the future
     * would be best served to just be an async function.
     */
    _run(input) {
        return Promise.resolve(input);
    }

}
```
