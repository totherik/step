const Graph = require('./graph');
const Schema = require('./schema');
const { async, clone } = require('./util');
const Factory = require('./states/factory');
const { EventEmitter } = require('events');


class Machine extends EventEmitter {

    static create(json) {
        Schema.validate(json);
        return new Machine(json);
    }

    constructor({ StartAt, States }) {
        super();
        this.graph = new Graph();
        this.states = States;
        this.startAt = this.build(StartAt);
    }

    build(name) {
        const { graph, states } = this;

        const state = states[name];
        state.Name = name;
        graph.addVertex(state);

        if (state.Next) {
            const next = this.build(state.Next);
            graph.addEdge(state, next, state.Next);
        }

        if (Array.isArray(state.Catch)) {
            state.Catch.forEach(({ Next }, index) => {
                const next = this.build(Next);
                graph.addEdge(state, next, Next);
            });
        }

        if (Array.isArray(state.Choices)) {
            state.Choices.forEach(({ Next }, index) => {
                const next = this.build(Next);
                graph.addEdge(state, next, Next);
            });
        }

        if (state.Default) {
            const next = this.build(state.Default);
            graph.addEdge(state, next, state.Default);
        }

        // Branches are handled internally to the Parallel State
        // because they don't define state transitions.

        return state;
    }

    run(input) {
        const { graph, startAt } = this;
        const run = this._runner();

        this.emit('ExecutionStarted', {
            input,
        });

        const resolve = output => {
            this.emit('ExecutionCompleted', {
                output,
            });

            return output;
        };

        return run(graph, startAt, input).then(resolve);
    }

    _runner() {
        return async(function *(graph, startAt, input) {
            let currentState = startAt;
            let result = input;

            while (currentState) {
                const { Name: name, Type: type } = currentState;

                this.emit('StateEntered', {
                    name,
                    input: result,
                });

                const state = Factory.create(currentState, Machine);
                const { output, next } = yield state.run(result);

                if (output instanceof Error) {
                    const error = {
                        Name: output.message,
                        Cause: output.stack,
                    };

                    this.emit('StateExited', {
                        name,
                        output: error,
                    });

                    return error;
                }

                const nextState = graph.getVertexAt(currentState, next);
                currentState = nextState;
                result = clone(output);

                this.emit('StateExited', {
                    name,
                    output,
                });
            }

            return result;
        }, this);
    }


}


module.exports = Machine;
