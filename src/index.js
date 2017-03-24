const Graph = require('./graph');
const Schema = require('./schema');
const { async } = require('./util');
const Factory = require('./states/factory');


class Machine {

    static create(json) {
        Schema.validate(json);
        return new Machine(json);
    }

    constructor({ StartAt, States }) {
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
        return run(graph, startAt, input);
    }

    _runner() {
        return async(function *(graph, startAt, input) {
            let currentState = startAt;
            let result = input;

            while (currentState) {
                const state = Factory.create(currentState, Machine);
                const { output, next } = yield state.run(result);
                const nextState = graph.getVertexAt(currentState, next);
                currentState = nextState;
                result = output;
            }

            return result;
        });
    }

}


module.exports = Machine;
