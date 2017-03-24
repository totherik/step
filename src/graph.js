

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

        if (adjacencies.has(vertexA)) {
            const edgesA = adjacencies.get(vertexA);
            for (let [ _, vertexB ] of edgesA.entries()) {

                if (adjacencies.has(vertexB)) {
                    const edgesB = adjacencies.get(vertexB);
                    for (let [ edge, vertex ] of edgesB.values()) {

                        if (vertex === vertexA) {
                            edgesB.delete(edge);
                            break;
                        }

                    }
                }

            }
            return !!adjacencies.delete(vertexA);
        }

        return false;
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
        edgesA.set(edgeValue, vertexB);
    }

    removeEdge(vertexA, vertexB) {
        const { adjacencies } = this;

        if (adjacencies.has(vertexA)) {
            for (const [ edge, vertex ] of adjacencies.get(vertexA)) {
                if (vertexB === vertex) {
                    return !!adjacencies.delete(edge);
                }
            }
        }

        return false;
    }

}


module.exports = Graph;
