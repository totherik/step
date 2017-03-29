const test = require('ava');
const Graph = require('./graph');


test('Add vertex', t => {

    const vertex = {};

    const g = new Graph();
    g.addVertex(vertex);
    t.true(g.adjacencies.has(vertex));

    g.addVertex(vertex);
    t.is(g.adjacencies.size, 1);

});


test('Get vertex', t => {

    const vertexA = {};
    const vertexB = {};
    const vertexC = {};
    const edge = 'a';

    const g = new Graph();
    g.addEdge(vertexA, vertexB, edge);
    t.is(g.getVertexAt(vertexA, edge), vertexB);
    t.is(g.getVertexAt(vertexC, edge), undefined);

});


test('Remove vertex', t => {

    const vertexA = {};
    const vertexB = {};
    const vertexC = {};
    const vertexD = {};

    const g = new Graph();
    g.addEdge(vertexA, vertexC);
    g.addVertex(vertexB);
    t.true(g.adjacencies.has(vertexA));

    t.true(g.removeVertex(vertexB));
    t.true(g.removeVertex(vertexA));
    t.true(g.removeVertex(vertexC));
    t.false(g.removeVertex(vertexD));
    t.false(g.adjacencies.has(vertexA));

});


test('Remove vertex with edges', t => {

    const vertexA = {};
    const vertexB = {};
    const edge = 'a';

    const g = new Graph();
    g.addEdge(vertexA, vertexB, edge);
    t.true(g.adjacencies.has(vertexA));
    t.true(g.adjacencies.has(vertexB));

    g.removeVertex(vertexB);
    t.false(g.adjacencies.has(vertexB));

    const neighbors = g.getNeighbors(vertexA);
    t.false(neighbors.has(edge));

});


test('Add new edge', t => {

    const vertexA = {};
    const vertexB = {};
    const vertexC = {};
    const edgeA = 'a';
    const edgeB = 'b';

    const g = new Graph();
    g.addEdge(vertexA, vertexB, edgeA);
    g.addEdge(vertexA, vertexC, edgeB);
    t.true(g.adjacencies.has(vertexA));
    t.true(g.adjacencies.has(vertexB));

    const edgesA = g.adjacencies.get(vertexA);
    const edgesB = g.adjacencies.get(vertexB);

    t.true(edgesA.has(edgeA));
    t.is(edgesA.get(edgeA), vertexB);
    t.false(edgesB.has(edgeA));

});


test('Update existing edge', t => {

    const vertexA = {};
    const vertexB = {};
    const edgeA = 'a';
    const edgeB = 'b';

    const g = new Graph();
    g.addEdge(vertexA, vertexB, edgeA);
    g.addEdge(vertexA, vertexB, edgeB);

    t.true(g.adjacencies.has(vertexA));
    t.true(g.adjacencies.has(vertexB));

    const edgesA = g.adjacencies.get(vertexA);
    const edgesB = g.adjacencies.get(vertexB);

    t.false(edgesA.has(edgeA));
    t.true(edgesA.has(edgeB));
    t.is(edgesA.get(edgeB), vertexB);

});


test('Remove edge', t => {

    const vertexA = {};
    const vertexB = {};
    const vertexC = {};
    const vertexD = {};
    const edgeA = 'a';
    const edgeB = 'b';

    const g = new Graph();
    g.addEdge(vertexA, vertexB, edgeA);
    g.addEdge(vertexA, vertexC, edgeB);

    t.true(g.adjacencies.has(vertexA));
    t.true(g.adjacencies.has(vertexB));

    const edges = g.adjacencies.get(vertexA);
    t.true(edges.has(edgeA));

    t.false(g.removeEdge(vertexA, vertexD));
    t.true(g.removeEdge(vertexA, vertexB));
    t.true(g.removeEdge(vertexA, vertexC));
    t.false(g.removeEdge(vertexD, vertexA));
    t.false(edges.has(edgeA));

});


test('Neighbors', t => {

    const vertexA = {};
    const vertexB = {};
    const edge = 'a';

    const g = new Graph();
    g.addEdge(vertexA, vertexB, edge);

    const neighbors = g.getNeighbors(vertexA);
    t.true(neighbors.has(edge));
    t.is(neighbors.get(edge), vertexB);

    const missing = g.getNeighbors({});
    t.is(missing.size, 0);

});
