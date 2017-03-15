# step

An [Amazon State Language](https://states-language.net/spec.html) based State Machine.

## Basic API
```js
const definition = {
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

const machine = new Machine(definition);
const result = await machine.run(input);
console.log(result);
```

## Testing
```bash
$ npm test
```
