# step

An [Amazon State Language](https://states-language.net/spec.html) based state machine.

## Basic API
```js
const json = {
    "StartAt": "Demo",
    "States": {
        "Demo": {
            "Type": "Pass",
            "Result": {
                "pass": {
                    "a": "b"
                }
            },
            "Next": "Done"
        },
        "Done": {
            "Type": "Succeed"
        }
    }
};

const input = {
    foo: {
        bar: true,
    },
};

const machine = Machine.create(json);
const result = await machine.run(input);
console.log(result);
```

## Testing
```bash
$ npm test
```

##### Notes
- The Node runtime version (in `.npmrc`) was explicitly chosen for OpenWhisk
compatibility. The associated stability that comes with selecting one runtime
is preferred for now (in the early stages of development) over flexbility
across providers.
- There are many things in this codebase that could be written much more tersely.
The goal is to keep expressiveness and readability until other factors, such as
performance, dictate otherwise.
- The overall mental model here is `Machine` (index.js) -> `States` (states/index.js)
-> {1..n} `State` (states/state.js) -> `Type` (states/\*.js) where the `State`
implementation is provided by the `Type` in a kind of Flyweight pattern.
