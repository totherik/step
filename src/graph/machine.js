const Graph = require('./graph');
const Factory = require('./factory');
const { async } = require('../util');


class Machine {

    static create(json) {
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
            let vertexA = startAt;
            let result = input;
            let start = process.hrtime();

            while (vertexA) {
                const state = Factory.create(vertexA, Machine);
                const { output, next } = yield state.run(result);

                console.log(vertexA.Name, vertexA.Type, 'run', process.hrtime(start));
                start = process.hrtime();

                const vertexB = graph.getVertexAt(vertexA, next);
                vertexA = vertexB;
                result = output;
            }

            return result;
        });
    }

}


module.exports = Machine;
