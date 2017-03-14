const test = require('ava');
const { validate } = require('../');


test('Pass Type', t => {

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
