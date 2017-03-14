const { Validator } = require('jsonschema');


function resolve(validator) {
    const { unresolvedRefs } = validator;
    const unresolved = unresolvedRefs.shift();
    if (unresolved) {
        validator.addSchema(require(`.${unresolved}`), unresolved);
        resolve(validator);
    }
}


function init(schema, name) {
    const validator = new Validator();
    validator.addSchema(schema, name);
    resolve(validator);

    return function validate(obj) {
        return validator.validate(obj, schema);
    };
}

const name = '/Schema';
const schema = { $ref: name };
const validate = init(schema, name);

module.exports = {
    validate,
};
