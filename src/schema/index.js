const { Validator } = require('jsonschema');

const name = '/Schema';
const schema = { $ref: name };

function resolve(validator) {
    const { unresolvedRefs } = validator;
    const unresolved = unresolvedRefs.shift();
    if (unresolved) {
        validator.addSchema(require(`.${unresolved}`), unresolved);
        resolve(validator);
    }
}


function init() {
    const validator = new Validator();
    validator.addSchema(schema, name);
    resolve(validator);
    return validator;
}


function validate(obj) {
    const validator = init();
    return validator.validate(obj, schema);
}


module.exports = {
    validate,
};
