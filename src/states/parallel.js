const  { mixin, Retry, Catch, Filter } = require('./mixins');


class Parallel extends mixin(Filter, Retry, Catch) {

    constructor(spec, Machine) {
        super(spec);
        const { Branches = [] } = spec;
        this.branches = Branches.map(Machine.create);
    }

    _run(input) {
        const tasks = this.branches.map(machine => machine.run(input));
        return Promise.all(tasks).then(output => ({ output }));
    }

}


module.exports = Parallel;
