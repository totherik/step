

class Graph {

    constructor() {
        // Optimize for look-ups. Delete will be slower.
        this.adjacencies = new Map(/* vertex, Map(edge, vertex)*/);
    }

    getNeighbors(vertex) {
        const { adjacencies } = this;
        return adjacencies.get(vertex) || new Map();
    }

    getVertexAt(vertexA, edgeA) {
        const { adjacencies } = this;
        if (adjacencies.has(vertexA)) {
            const edges = adjacencies.get(vertexA);
            return edges.get(edgeA);
        }
        return undefined;
    }

    addVertex(vA) {
        const { adjacencies } = this;
        if (!adjacencies.has(vA)) {
            adjacencies.set(vA, new Map());
        }
    }

    removeVertex(vertexA) {
        const { adjacencies } = this;

        if (!adjacencies.has(vertexA)) {
            return false;
        }

        for (let [ _ , edges ] of adjacencies.entries()) {
            for (let [ edge, vertex ] of edges.entries()) {
                if (vertex === vertexA) {
                    edges.delete(edge);
                }
            }
        }

        return adjacencies.delete(vertexA);
    }

    addEdge(vertexA, vertexB, edgeValue) {
        const { adjacencies } = this;

        if (!adjacencies.has(vertexA)) {
            this.addVertex(vertexA);
        }

        if (!adjacencies.has(vertexB)) {
            this.addVertex(vertexB);
        }

        const edgesA = adjacencies.get(vertexA);

        // Delete existing edges between the two vertices. May
        // not want to do this and allow multiple edges with multiple
        // values, but for now only allow one.
        for (const [ edge, vertex ] of edgesA) {
            if (vertex === vertexB) {
                edgesA.delete(edge);
                break;
            }
        }

        edgesA.set(edgeValue, vertexB);
    }

    removeEdge(vertexA, vertexB) {
        const { adjacencies } = this;

        if (adjacencies.has(vertexA)) {
            const edgesA = adjacencies.get(vertexA);
            for (const [ edge, vertex ] of edgesA) {
                if (vertex === vertexB) {
                    return edgesA.delete(edge);
                }
            }
        }

        return false;
    }

}


module.exports = Graph;
