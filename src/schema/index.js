const { Validator } = require('jsonschema');


function resolve(validator) {
    const { unresolvedRefs: refs } = validator;
    const name = refs.shift();
    if (name) {
        const schema = require(`.${name}`);
        validator.addSchema(schema, name);
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
