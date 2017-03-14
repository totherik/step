const test = require('ava');
const { validate } = require('./schema');


test('Amazon States Lang', t => {

    const pass = {
        "StartAt": "PassTest",
        "States": {
            "PassTest": {
                "Type": "Pass",
                "InputPath": "$",
                "ResultPath": "$.foo",
                "OutputPath": "$.foo.pass",
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

    const { errors } = validate(pass);
    t.is(errors.length, 0);

});
