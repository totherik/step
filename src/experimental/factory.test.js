const test = require('ava');
const Factory = require('./factory');


test('Factory', t => {

    const json = {
        StartAt: 'One',
        States: {
            One: {
                Type: 'Pass',
                Next: 'Two',
            },
            Two: {
                Type: 'Wait',
                Next: 'Three',
            },
            Three: {
                Type: 'Pass',
                Next: 'Four',
            },
            Four: {
                Type: 'Succeed',
            },
        },
    };

    const factory = Factory.create(json.States);
    const state = factory.build(json.StartAt);

    return state.run({ a: 'foo' }).then(output => {
        t.is(output.a, 'foo');
    });

});





// test('Builder', t => {
//
//     const json = {
//         StartAt: 'One',
//         States: {
//             One: {
//                 Type: 'Pass',
//                 Next: 'Two',
//             },
//             Two: {
//                 Type: 'Task',
//                 Resource: 'abc123',
//                 Catch: [{
//                     ErrorEquals: [ 'States.ALL'],
//                     Next: 'Three',
//                 }],
//                 Next: 'Three'
//             },
//             Three: {
//                 Type: 'Choice',
//                 Choices: [
//                     {
//                         StringEquals: 'value',
//                         Next: 'Four',
//                     }
//                 ],
//                 Default: 'Four'
//             },
//             Four: {
//                 Type: 'Parallel',
//                 Branches: [{
//                     StartAt: 'FourOne',
//                     States: {
//                         FourOne: {
//                             Type: 'Pass',
//                             Next: 'FourTwo',
//                         },
//                         FourTwo: {
//                             Type: 'Pass',
//                             End: true,
//                         },
//                     },
//                 }],
//                 Next: 'Five',
//                 Catch: [{
//                     ErrorEquals: [ 'States.ALL'],
//                     Next: 'Five',
//                 }]
//             },
//             Five: {
//                 Type: 'Succeed'
//             },
//         },
//     };
//
//     const machine = Builder.build(json);
//     console.log(machine);
// });
