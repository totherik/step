const test = require('ava');
const Schema = require('../');


test('Invalid Schema', t => {

    const invalid = {
        StartAt: '',
        States: null
    };

    t.throws(() => {
        Schema.validate(invalid);
    });

});


test('Pass Type', t => {

    const pass = {
        StartAt: "PassTest",
        States: {
            PassTest: {
                Type: "Pass",
                InputPath: "$",
                ResultPath: "$.foo",
                OutputPath: "$.foo.pass",
                Result: {
                    pass: {
                        a: "b"
                    }
                },
                Next: "Done"
            },
            Done: {
                Type: "Succeed"
            }
        }
    };

    Schema.validate(pass);

});
