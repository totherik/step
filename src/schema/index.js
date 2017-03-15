const { Validator } = require('jsonschema');


function resolveReferences(validator) {
    const { unresolvedRefs: refs } = validator;
    const name = refs.shift();
    if (name) {
        const schema = require(`.${name}`);
        validator.addSchema(schema, name);
        resolveReferences(validator);
    }
}

function init(schema, name) {
    const validator = new Validator();
    validator.addSchema(schema, name);
    resolveReferences(validator);

    return function validate(obj) {
        const { errors } = validator.validate(obj, schema);
        if (errors.length) {
            // Blah! https://github.com/tdegrunt/jsonschema/pull/174
            // Should probably find a new JSON Schema validation library.
            const [{ message, schema, property, instance, name, argument, stack }] = errors;
            const error = new Error(message);
            error.schema = schema;
            error.property = property;
            error.instance = instance;
            error.name = name;
            error.argument = argument;
            error.stack = stack;
            throw error;
        }
    };
}


const name = '/Schema';
const schema = { $ref: name };
const validate = init(schema, name);

module.exports = {
    validate,
};
