# Amazon States Language JSONSchema
This is a JSON Schema that validates JSON-based state machine descriptions
according to the [Amazon States Language](https://states-language.net/spec.html).
This does _not_ completely fulfill the specification as to behavior, only the
rules that describe a valid state machine.

The top level type is [Schema.json](./Schema.json).

(This could possibly be its own npm module at some point.)


NOTE: While it's fairly well-organized (I think), a caveat here is that error
reporting on individual Task types is somewhat lacking as the validation just
reports it can't find a matching type for the provided input. This should
probably be improved.
