const  { mixin, Retry, Filter } = require('./mixins');


class Parallel extends mixin(Retry, Filter) {

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
