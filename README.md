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
