const  { mixin, Catch, Filter } = require('./mixins');


class Parallel extends mixin(Catch, Filter) {

    constructor(spec, Machine) {
        super(spec);
        const { Branches = [] } = spec;
        this.branches = Branches.map(Machine.create);
    }

    _run(input) {
        // TODO: Retry
        const tasks = this.branches.map(machine => machine.run(input));
        return Promise.all(tasks);
    }

}


module.exports = Parallel;
