const Graph = require('./graph');
const Factory = require('./factory');


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
        this.stack = [];
        return this._run(this.startAt, input);
    }

    _run(vertexA, input) {
        const { graph } = this;
        const impl = Factory.create(vertexA, Machine);
        const start = process.hrtime();

        const fulfilled = fn => {
            return result => {
                this.stack.push([ vertexA.Name, process.hrtime(start) ]);

                const resolve = next => {
                    const vertexB = graph.getVertexAt(vertexA, next);
                    return vertexB ? this._run(vertexB, result) : fn(result);
                };

                return impl.getNext().then(resolve);
            };
        }

        const resolved = fulfilled(output => output);
        const rejected = fulfilled(output => Promise.reject(output));
        return impl.run(input).then(resolved, rejected);
    }

}


module.exports = Machine;
