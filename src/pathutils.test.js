const test = require('ava');
const PathUtils = require('./pathutils');


test('PathUtils.isDefinitePath', t => {

    const definite = [
        '$',
        '$.store.book[0].author',
        '$["store"]["book"][3]["author"]',
    ];

    const indefinite = [
        '$.store.book[*].author',
        '$..author',
        '$.store.*',
        '$.store..price',
        '$..book[2]',
        '$..book[(@.length-1)]',
        '$..book[-1:]',
        '$..book[0,1]',
        '$..book[:2]',
        '$..book[?(@.isbn)]',
        '$..book[?(@.price<10)]',
        '$..book[?(@.price==8.95)]',
        '$..book[?(@.price<30 && @.category=="fiction")]',
        '$..*',
        '$.store.book[?(@.price < 10)]',
        '$.a[0,1]',
    ];

    for (let path of definite) {
        t.true(PathUtils.isDefinitePath(path));
    }

    for (let path of indefinite) {
        t.false(PathUtils.isDefinitePath(path));
    }

});
