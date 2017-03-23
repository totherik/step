const mixins = require('./mixins');
const Filter = require('./mixins/filter');


class Succeed extends mixins(Filter) {

    constructor(spec) {
        super(spec);
    }

    _run(input) {
        return Promise.resolve(input);
    }

}


module.exports = Succeed;
