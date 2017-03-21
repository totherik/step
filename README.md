# step

An [Amazon State Language](https://states-language.net/spec.html) based state machine.

It is probably worth pointing out that this design probably isn't terribly
practical in reality. There are many ways to solve this problem but the current
structure was chosen for ease of development, to better understand the problem
space, and to get a feel for the Amazon State Language spec itself. One could
imagine many different approaches, including:
- **Separate the validation and execution steps:** Validation and deployment of a
specification versus the runtime invocation are distinctly different as it
pertains to the overall lifecycle of the state machine. One approach could be to
validate both structure and data integrity, then place the valid specification
in a data store. At runtime the state machine could reference that specification
by name, retrieve it, and run the machine to completion.
- **Generate the state machine implementation:** Perhaps a more efficient solution
would be to generate and deploy the complete implementation (a FaaS Function)
based on the provided spec. The platform could either change the implementation
of how it would fulfill remote Tasks based on the FaaS provider, or the
implementation could be provided by the author. (I like this one, personally.)

See additional [notes below](#notes).


## Experimental
All new work is going in `/experimental` as I thought using mixins would make
things more reasonable. One caveat to this is when one needs to initialize
properties that result in a state type getting created. For example, `Task`
states have "Catchers" that are linked to subsequent states (via `Next`).
Because there is a common shared factory (factory.js) to generate states, that
factory needs to be passed into state factory functions, but it isn't passed
into State constructors. Due to that, anything internal properties that a mixin
needs to be initialized will have to be initialized in the implementing State's
factory function (`create`). It may not be a problem , but it's not overly obvious
when creating new States and adding mixins.

This version generates the entire machine prior to execution. Since a FaaS
deployment is generally compute on-demand, rather than building the whole thing
on each initialization, an optimization might be to JIT create and execute each
state in the tree in response to each runtime state transition.


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
- The overall mental model here is `Machine -> States -> {1..n} State -> Type`
where the `State` implementation is provided by the `Type` in a kind of
Flyweight pattern.
- Be aware that some `Type`s compose `States` as well. For example, `Parallel`
and `Choice` run state machines internal to their type.
- Even though Classes are used, this codebase favors exposing Factories over
Constructors both internally and externally.
