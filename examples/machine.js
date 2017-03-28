const json = require('./machine.json');
const Machine = require('../src/index');


const log = name => {
    const states = json.States;
    return ({ name: stateName = '', input, output }) => {
        const state = states[stateName] || { Type: '' };
        console.log(new Date().toISOString(), `${state.Type}${name}`, JSON.stringify(input || output));
    };
}

const machine = Machine.create(json);
machine.on('ExecutionStarted', log('ExecutionStarted'));
machine.on('ExecutionCompleted', log('ExecutionCompleted'));
machine.on('StateEntered', log('StateEntered'));
machine.on('StateExited', log('StateExited'));
machine.run({});
